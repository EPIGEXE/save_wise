import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";
import { IncomeCategory } from "./IncomeCategory.js";
import { ExpenseCategory } from "./ExpenseCategory.js";

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

    @ManyToOne(() => PaymentMethod, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'paymentMethodId' })
    paymentMethod?: PaymentMethod;

    @Column({ nullable: true })
    paymentMethodId?: number;

    paymentDay?: number;

    @ManyToOne(() => IncomeCategory, category => category.transactions, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'incomeCategoryId' })
    incomeCategory?: IncomeCategory;

    @Column({ nullable: true })
    incomeCategoryId?: number;

    @ManyToOne(() => ExpenseCategory, category => category.transactions, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: ExpenseCategory;

    @Column({ nullable: true })
    expenseCategoryId?: number;
}
