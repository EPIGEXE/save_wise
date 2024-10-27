import { logger } from "../util/logger.js";
import { TransactionRepository } from "../repository/TransactionRepository.js";
export default class TransactionService {
    constructor(dataSource) {
        this.transactionRepository = new TransactionRepository(dataSource);
    }
    async getAllTransaction() {
        try {
            // logger.info("거래 목록 조회 시작");
            const transactions = await this.transactionRepository.findAllWithPaymentMethod();
            // logger.info(`${transactions.length}개의 거래 조회 완료`);
            return this.convertToDto(transactions);
        }
        catch (error) {
            logger.error("거래 목록 조회 중 오류 발생", error);
            throw new Error("거래 목록을 가져오는 데 실패했습니다.");
        }
    }
    async createTransaction(transactionData) {
        try {
            // logger.info("새 거래 생성 시작", { data: transactionData });
            const entities = this.convertToEntity(transactionData);
            const savedTransactions = [];
            for (const entity of entities) {
                const savedTransaction = await this.transactionRepository.save(entity);
                savedTransactions.push(savedTransaction);
                // logger.info("새 거래 생성 완료", { id: savedTransaction.id });
            }
            // logger.info(`총 ${savedTransactions.length}개의 새 거래 생성 완료`);
            return savedTransactions;
        }
        catch (error) {
            logger.error("거래 생성 중 오류 발생", error);
            throw new Error("새 거래를 생성하는 데 실패했습니다.");
        }
    }
    async updateTransaction(transaction) {
        try {
            // logger.info("거래 수정 시작", { data: transaction });
            await this.transactionRepository.update(transaction.id, transaction);
            // logger.info("거래 수정 완료", { id: transaction.id });
        }
        catch (error) {
            logger.error("거래 수정 중 오류 발생", error);
            throw new Error("거래를 수정하는 데 실패했습니다.");
        }
    }
    async deleteTransaction(transaction) {
        try {
            // logger.info("거래 삭제 시작", { id: delectTransactionId });
            await this.transactionRepository.delete(transaction.id);
            // logger.info("거래 삭제 완료", { id: delectTransactionId });
        }
        catch (error) {
            logger.error("거래 삭제 중 오류 발생", error);
            throw new Error("거래를 삭제하는 데 실패했습니다.");
        }
    }
    convertToDto(transactionList) {
        const formatted = {};
        transactionList.forEach((transaction) => {
            const dateString = transaction.date.split('T')[0];
            if (!formatted[dateString]) {
                formatted[dateString] = [];
            }
            formatted[dateString].push({
                id: transaction.id,
                amount: transaction.amount,
                description: transaction.description,
                type: transaction.type,
                paymentMethodId: transaction.paymentMethodId || null,
                paymentMethod: transaction.paymentMethod || undefined,
                incomeCategoryId: transaction.incomeCategoryId || undefined,
                expenseCategoryId: transaction.expenseCategoryId || undefined
            });
        });
        return formatted;
    }
    convertToEntity(transactionDto) {
        const entities = [];
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
//# sourceMappingURL=TransactionService.js.map