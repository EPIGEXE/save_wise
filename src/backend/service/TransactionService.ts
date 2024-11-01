import { Transaction } from "../db/entity/Transaction.js";
import { logger } from "../util/logger.js";
import { TransactionRepository } from "../repository/TransactionRepository.js";
import { Between, DataSource } from "typeorm";
import { PaymentMethod } from "../db/entity/PaymentMethod.js";
import { AppDataSource } from "../db/database.js";
import { Asset } from "../db/entity/Asset.js";

interface TransactionItem {
    id?: number;
    amount: number;
    description: string;
    type: 'income' | 'expense';
    paymentMethodId: number | null;
    paymentMethod?: PaymentMethod;
    incomeCategoryId?: number;
    expenseCategoryId?: number;
}

export interface TransactionDto {
    [date: string]: TransactionItem[];
}

export default class TransactionService {
    private transactionRepository: TransactionRepository;
    private assetRepository = AppDataSource.getRepository(Asset);
    private paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);

    constructor(dataSource: DataSource) {
        this.transactionRepository = new TransactionRepository(dataSource);
    }

    async getAllTransaction(): Promise<TransactionDto> {
        try {
            // logger.info("거래 목록 조회 시작");
            const transactions = await this.transactionRepository.find();
            // logger.info(`${transactions.length}개의 거래 조회 완료`);
            return this.convertToDto(transactions);
          } catch (error) {
            logger.error("거래 목록 조회 중 오류 발생", error);
            throw new Error("거래 목록을 가져오는 데 실패했습니다.");
        }
    }

    async createTransaction(transactionData: TransactionDto): Promise<Transaction[]> {
        return AppDataSource.transaction(async transactionalEntityManager => {
            const entities = this.convertToEntity(transactionData);
            const savedTransactions: Transaction[] = [];
    
            for (const entity of entities) {
                const savedTransaction = await transactionalEntityManager.save(Transaction, entity);
                await this.updateAsset(savedTransaction);
                savedTransactions.push(savedTransaction);
            }
    
            return savedTransactions;
        }).catch(error => {
            logger.error("거래 생성 중 오류 발생", error);
            throw new Error("새 거래를 생성하는 데 실패했습니다.");
        });
    }

    async updateTransaction(transaction: Transaction): Promise<void> {
        try {
            // logger.info("거래 수정 시작", { data: transaction });
            await this.transactionRepository.update(transaction.id, transaction);
            // logger.info("거래 수정 완료", { id: transaction.id });
        } catch (error) {
            logger.error("거래 수정 중 오류 발생", error);
            throw new Error("거래를 수정하는 데 실패했습니다.");
        }
    }

    async deleteTransaction(transaction: Transaction): Promise<void> {
        try {
            // logger.info("거래 삭제 시작", { id: delectTransactionId });
            await this.transactionRepository.delete(transaction.id);
            // logger.info("거래 삭제 완료", { id: delectTransactionId });
        } catch (error) {
            logger.error("거래 삭제 중 오류 발생", error);
            throw new Error("거래를 삭제하는 데 실패했습니다.");
        }
    }

    private async updateAsset(entity: Partial<Transaction>): Promise<void> {

        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id: entity.paymentMethodId }
        });

        if (entity.type === 'income') {
            const connectedAsset = await this.assetRepository.findOne({ 
                where: { id: entity.incomeCategoryId } 
            });
            if (connectedAsset && entity.amount) {
                connectedAsset.amount += entity.amount;
                await this.assetRepository.save(connectedAsset);
            }
        } else if (entity.type === 'expense' && paymentMethod?.type === 'cash') {
            const connectedAsset = await this.assetRepository.findOne({ 
                where: { id: entity.expenseCategoryId } 
            });
            if (connectedAsset && entity.amount) {
                connectedAsset.amount -= entity.amount;
                await this.assetRepository.save(connectedAsset);
            }
        }
    }

    async findAllByMonth(year: number, month: number): Promise<Transaction[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        return this.transactionRepository.find({
            relations: {
                paymentMethod: true,
                incomeCategory: true,
                expenseCategory: true
            },
            where: {
                date: Between(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])
            }
        });
    }

    async findAllByPreviousMonthAndCredit(year: number, month: number): Promise<Transaction[]> {
        const startDate = new Date(year, month - 2, 1);
        const endDate = new Date(year, month - 1, 0);
        
        return this.transactionRepository.find({
            relations: {
                paymentMethod: true,
                expenseCategory: true
            },
            where: {
                date: Between(startDate.toISOString(), endDate.toISOString()),
                type: "expense",
                paymentMethod: {
                    type: "credit"
                }
            }
        });
    }

    async findAllByDateRangeAndPaymentMethod(startDate: Date, endDate: Date, paymentMethodId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: { date: Between(startDate.toISOString(), endDate.toISOString()), paymentMethodId }
        });
    }

    private convertToDto(transactionList: Transaction[]): TransactionDto {
        const formatted: TransactionDto = {};

        transactionList.forEach((transaction) => {
            const dateString = transaction.date.split('T')[0];
            if (!formatted[dateString]) {
                formatted[dateString] = [];
            }
            formatted[dateString].push({
                id: transaction.id,
                amount: transaction.amount,
                description: transaction.description,
                type: transaction.type as 'income' | 'expense',
                paymentMethodId: transaction.paymentMethodId || null,
                paymentMethod: transaction.paymentMethod || undefined,
                incomeCategoryId: transaction.incomeCategoryId || undefined,
                expenseCategoryId: transaction.expenseCategoryId || undefined
            });
        });
        return formatted;
    }

    private convertToEntity(transactionDto: TransactionDto): Partial<Transaction>[] {
        const entities: Partial<Transaction>[] = [];

        for (const [dateString, transactions] of Object.entries(transactionDto)) {
            for (const transaction of transactions) {
                entities.push({
                    date: new Date(dateString).toISOString(),
                    amount: transaction.amount,
                    description: transaction.description,
                    type: transaction.type,
                    paymentMethodId: transaction.paymentMethodId || undefined,
                    incomeCategoryId: transaction.incomeCategoryId || undefined,
                    expenseCategoryId: transaction.expenseCategoryId || undefined
                });
            }
        }
        return entities;
    }
}