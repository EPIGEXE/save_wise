import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";

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

    @Column({ nullable: true })
    paymentMethodName?: string;
}
