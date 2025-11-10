import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Transaction } from "typeorm";
import type { IncomeCategory } from "./IncomeCategory.js";
import type { ExpenseCategory } from "./ExpenseCategory.js";
import { IFixedCost } from "@/types/index.js";

// 고정 비용 엔티티
@Entity()
export class FixedCost implements IFixedCost {
    @PrimaryGeneratedColumn()
    id!: number; // 고정 비용 ID

    @Column()
    name!: string; // 고정 비용 이름

    @Column()
    prospectDay!: number; // 고정 비용 예정 날짜

    @Column()
    amount!: number; // 고정 비용 금액

    @Column()
    type!: "expense" | "income"; // 고정 비용 유형

    @Column({ nullable: true })
    incomeCategoryId?: number; // 수입 카테고리 ID

    @ManyToOne('IncomeCategory', 'fixedCosts', {  
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'incomeCategoryId' })
    incomeCategory?: IncomeCategory; // 수입 카테고리

    @Column({ nullable: true })
    expenseCategoryId?: number; // 지출 카테고리 ID

    @ManyToOne('ExpenseCategory', 'fixedCosts', {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: ExpenseCategory; // 지출 카테고리

    @OneToMany('Transaction', 'fixedCost')
    transactions?: Transaction[]; // 고정 비용 거래 내역
}