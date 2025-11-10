import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction.js";
import { FixedCost } from "./FixedCost.js";
import { Goal } from "./Goal.js";
import { IExpenseCategory } from "@/types/index.js";

// 지출 카테고리 엔티티
@Entity()
export class ExpenseCategory implements IExpenseCategory {
    @PrimaryGeneratedColumn()
    id!: number; // 지출 카테고리 ID

    @Column()
    name!: string; // 지출 카테고리 이름

    @OneToMany(() => Transaction, transaction => transaction.expenseCategory)
    transactions!: Transaction[]; // 지출 카테고리 거래 내역

    @OneToMany(() => FixedCost, fixedCost => fixedCost.expenseCategory)
    fixedCosts!: FixedCost[]; // 지출 카테고리 고정 비용

    @OneToMany(() => Goal, goal => goal.expenseCategory, {eager: true})
    goals!: Goal[]; // 지출 카테고리 목표
}