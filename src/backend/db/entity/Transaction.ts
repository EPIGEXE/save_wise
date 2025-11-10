import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";
import { IncomeCategory } from "./IncomeCategory.js";
import { ExpenseCategory } from "./ExpenseCategory.js";
import { FixedCost } from "./FixedCost.js";
import { ITransaction } from "@/types/index.js";

// 거래 내역 엔티티
@Entity()
export class Transaction implements ITransaction {
    @PrimaryGeneratedColumn()
    id!: number; // 거래 내역 ID

    @Column()
    date!: string; // 거래 내역 날짜

    @Column()
    amount!: number; // 거래 내역 금액

    @Column({ nullable: true })
    description!: string; // 거래 내역 설명

    @Column()
    type!: "income" | "expense"; // 거래 내역 유형

    @ManyToOne(() => PaymentMethod, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'paymentMethodId' })
    paymentMethod?: PaymentMethod; // 결제 방법

    @Column({ nullable: true })
    paymentMethodId?: number; // 결제 방법 ID

    @ManyToOne(() => IncomeCategory, category => category.transactions, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'incomeCategoryId' })
    incomeCategory?: IncomeCategory; // 수입 카테고리

    @Column({ nullable: true })
    incomeCategoryId?: number; // 수입 카테고리 ID

    @ManyToOne(() => ExpenseCategory, category => category.transactions, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: ExpenseCategory; // 지출 카테고리

    @Column({ nullable: true })
    expenseCategoryId?: number; // 지출 카테고리 ID

    @Column({ nullable: true })
    fixedCostId?: number; // 고정 비용 ID

    @ManyToOne(() => FixedCost, fixedCost => fixedCost.transactions, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'fixedCostId' })
    fixedCost?: FixedCost; // 고정 비용
}
