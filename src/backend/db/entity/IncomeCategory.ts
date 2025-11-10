import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction.js";
import { FixedCost } from "./FixedCost.js";
import { IIncomeCategory } from "@/types/index.js";

// 수입 카테고리 엔티티
@Entity()
export class IncomeCategory implements IIncomeCategory {
    @PrimaryGeneratedColumn()
    id!: number; // 수입 카테고리 ID

    @Column()
    name!: string; // 수입 카테고리 이름

    @OneToMany(() => Transaction, transaction => transaction.incomeCategory)
    transactions!: Transaction[]; // 수입 카테고리 거래 내역

    @OneToMany(() => FixedCost, fixedCost => fixedCost.incomeCategory)
    fixedCosts!: FixedCost[]; // 수입 카테고리 고정 비용
}