import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction.js";

@Entity()
export class ExpenseCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Transaction, transaction => transaction.expenseCategory)
    transactions!: Transaction[];
}