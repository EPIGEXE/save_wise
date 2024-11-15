import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction.js";
import { FixedCost } from "./FixedCost.js";
import { Goal } from "./Goal.js";

@Entity()
export class ExpenseCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Transaction, transaction => transaction.expenseCategory)
    transactions!: Transaction[];

    @OneToMany(() => FixedCost, fixedCost => fixedCost.expenseCategory)
    fixedCosts!: FixedCost[];

    @OneToMany(() => Goal, goal => goal.expenseCategory, {eager: true})
    goals!: Goal[];
}