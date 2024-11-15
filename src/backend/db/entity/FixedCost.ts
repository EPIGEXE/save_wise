import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Transaction } from "typeorm";
import type { IncomeCategory } from "./IncomeCategory.js";
import type { ExpenseCategory } from "./ExpenseCategory.js";

@Entity()
export class FixedCost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    prospectDay!: number;

    @Column()
    amount!: number;

    @Column()
    type!: "expense" | "income";

    @Column({ nullable: true })
    incomeCategoryId?: number;

    @ManyToOne('IncomeCategory', 'fixedCosts', {  
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'incomeCategoryId' })
    incomeCategory?: IncomeCategory;

    @Column({ nullable: true })
    expenseCategoryId?: number;

    @ManyToOne('ExpenseCategory', 'fixedCosts', {  // 문자열로 엔티티 지정
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: ExpenseCategory;

    @OneToMany('Transaction', 'fixedCost')
    transactions?: Transaction[];
}