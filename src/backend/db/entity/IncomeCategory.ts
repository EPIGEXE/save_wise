import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction.js";

@Entity()
export class IncomeCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Transaction, transaction => transaction.incomeCategory)
    transactions!: Transaction[];
}