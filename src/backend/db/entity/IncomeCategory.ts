import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction.js";
import { FixedCost } from "./FixedCost.js";

@Entity()
export class IncomeCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Transaction, transaction => transaction.incomeCategory)
    transactions!: Transaction[];

    @OneToMany(() => FixedCost, fixedCost => fixedCost.incomeCategory)
    fixedCosts!: FixedCost[];
}