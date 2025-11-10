import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { ExpenseCategory } from "./ExpenseCategory.js";
import { IGoal } from "@/types";

// 목표 엔티티
@Entity()
export class Goal implements IGoal {
    @PrimaryGeneratedColumn()
    id!: number; // 목표 ID

    @Column()
    name!: string; // 목표 이름

    @Column()
    targetAmount!: number; // 목표 금액
    
    @Column({ nullable: true })
    expenseCategoryId?: number; // 지출 카테고리 ID

    @ManyToOne('ExpenseCategory', 'goals', {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: ExpenseCategory; // 지출 카테고리
}