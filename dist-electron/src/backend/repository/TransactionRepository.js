import { Repository } from "typeorm";
import { Transaction } from "../db/entity/Transaction.js";
export class TransactionRepository extends Repository {
    constructor(dataSource) {
        super(Transaction, dataSource.createEntityManager());
    }
    async findAllWithPaymentMethod() {
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
}
//# sourceMappingURL=TransactionRepository.js.map