import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";
import { IncomeCategory } from "./IncomeCategory.js";
import { ExpenseCategory } from "./ExpenseCategory.js";
import { FixedCost } from "./FixedCost.js";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    date!: string;

    @Column()
    amount!: number;

    @Column({ nullable: true })
    description!: string;

    @Column()
    type!: "income" | "expense";

    @ManyToOne(() => PaymentMethod, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'paymentMethodId' })
    paymentMethod?: PaymentMethod;

    @Column({ nullable: true })
    paymentMethodId?: number;

    @ManyToOne(() => IncomeCategory, category => category.transactions, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'incomeCategoryId' })
    incomeCategory?: IncomeCategory;

    @Column({ nullable: true })
    incomeCategoryId?: number;

    @ManyToOne(() => ExpenseCategory, category => category.transactions, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: ExpenseCategory;

    @Column({ nullable: true })
    expenseCategoryId?: number;

    @Column({ nullable: true })
    fixedCostId?: number;

    @ManyToOne(() => FixedCost, fixedCost => fixedCost.transactions, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'fixedCostId' })
    fixedCost?: FixedCost;
}
