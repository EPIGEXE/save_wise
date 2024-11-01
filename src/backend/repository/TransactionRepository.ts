import { DataSource, Repository } from "typeorm";
import { Transaction } from "../db/entity/Transaction.js";

export class TransactionRepository extends Repository<Transaction> {
    constructor(dataSource: DataSource) {
        super(Transaction, dataSource.createEntityManager());
    }

    async findAllWithPaymentMethod(): Promise<Transaction[]> {
        const transactions = await this.createQueryBuilder("transaction")
            .leftJoinAndSelect("transaction.paymentMethod", "paymentMethod")
            .select([
                "transaction.id",
                "transaction.amount",
                "transaction.description",
                "transaction.type",
                "transaction.date",
                "transaction.paymentMethodId",
                "paymentMethod.paymentDay"
            ])
            .getMany();

        return transactions;
    }

    async findAllByMonth(year: number, month: number): Promise<Transaction[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        const transactions = await this.createQueryBuilder("transaction")
            .leftJoinAndSelect("transaction.paymentMethod", "paymentMethod")
            .leftJoinAndSelect("transaction.incomeCategory", "incomeCategory", "transaction.type = :incomeType", { incomeType: "income" })
            .leftJoinAndSelect("transaction.expenseCategory", "expenseCategory", "transaction.type = :expenseType", { expenseType: "expense" })
            .select([
                "transaction.id",
                "transaction.amount",
                "transaction.description",
                "transaction.type",
                "transaction.date",
                "transaction.paymentMethodId",
                "transaction.incomeCategoryId",
                "transaction.expenseCategoryId",
                "paymentMethod.paymentDay",
                "paymentMethod.name",
                "incomeCategory.name",
                "expenseCategory.name"
            ])
            .where("transaction.date BETWEEN :startDate AND :endDate", {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            })
            .getMany();

        return transactions;
    }

    async findAllByPreviousMonthAndCredit(year: number, month: number): Promise<Transaction[]> {
        const startDate = new Date(year, month - 1, 1);  // 지난 달 1일
        const endDate = new Date(year, month - 1, 31);   // 지난 달 말일
    
        const transactions = await this.createQueryBuilder("transaction")
            .leftJoinAndSelect("transaction.paymentMethod", "paymentMethod")
            .leftJoinAndSelect("transaction.expenseCategory", "expenseCategory", "transaction.type = :expenseType", { expenseType: "expense" })
            .select([
                "transaction.id",
                "transaction.amount",
                "transaction.description",
                "transaction.type",
                "transaction.date",
                "transaction.paymentMethodId",
                "transaction.incomeCategoryId",
                "transaction.expenseCategoryId",
                "paymentMethod.paymentDay",
                "paymentMethod.name",
                "expenseCategory.name"
            ])
            .where("transaction.date BETWEEN :startDate AND :endDate", {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            })
            .andWhere("paymentMethod.type = :type", { type: "credit" })
            .andWhere("transaction.type = :transactionType", { transactionType: "expense" })
            .getMany();
    
        return transactions;
    }
}