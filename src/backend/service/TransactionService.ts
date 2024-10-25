import { Transaction } from "../db/entity/Transaction.js";
import { AppDataSource } from "../db/database.js";
import { logger } from "../util/logger.js";

interface TransactionItem {
    id?: number;
    amount: number;
    description: string;
    type: 'income' | 'expense';
}

interface TransactionDto {
    [date: string]: TransactionItem[];
}

export default class TransactionService {
    private transactionRepository = AppDataSource.getRepository(Transaction)

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
        try {
            // logger.info("새 거래 생성 시작", { data: transactionData });
            const entities = this.convertToEntity(transactionData);
            const savedTransactions: Transaction[] = [];
    
            for (const entity of entities) {
                const savedTransaction = await this.transactionRepository.save(entity);
                savedTransactions.push(savedTransaction);
                // logger.info("새 거래 생성 완료", { id: savedTransaction.id });
            }

            // logger.info(`총 ${savedTransactions.length}개의 새 거래 생성 완료`);
            return savedTransactions;
        } catch (error) {
            logger.error("거래 생성 중 오류 발생", error);
            throw new Error("새 거래를 생성하는 데 실패했습니다.");
        }
    }

    async deleteTransaction(transaction: Transaction): Promise<void> {
        try {
            const delectTransactionId = transaction.id;
            await this.transactionRepository.delete(delectTransactionId);
        } catch (error) {
            logger.error("거래 삭제 중 오류 발생", error);
            throw new Error("거래를 삭제하는 데 실패했습니다.");
        }
    }

    async updateTransaction(transaction: Transaction): Promise<void> {
        try {
            await this.transactionRepository.update(transaction.id, transaction);
        } catch (error) {
            logger.error("거래 수정 중 오류 발생", error);
            throw new Error("거래를 수정하는 데 실패했습니다.");
        }
    }

    convertToDto(transactionList: Transaction[]): TransactionDto {
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
                type: transaction.type as 'income' | 'expense'
            });
        });
        return formatted;
    }

    convertToEntity(transactionDto: TransactionDto): Partial<Transaction>[] {
        const entities: Partial<Transaction>[] = [];

        for (const [dateString, transactions] of Object.entries(transactionDto)) {
            for (const transaction of transactions) {
                entities.push({
                    date: new Date(dateString).toISOString(),
                    amount: transaction.amount,
                    description: transaction.description,
                    type: transaction.type
                });
            }
        }
        return entities;
    }
}