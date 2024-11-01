import { Between, DataSource, Repository } from "typeorm";
import { Transaction } from "../db/entity/Transaction.js";

export class TransactionRepository extends Repository<Transaction> {
    constructor(dataSource: DataSource) {
        super(Transaction, dataSource.createEntityManager());
    }
    
}