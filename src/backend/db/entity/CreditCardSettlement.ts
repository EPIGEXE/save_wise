import { Column, JoinColumn, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";

@Entity()
export class CreditCardSettlement {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    paymentMethodId!: number;

    @ManyToOne(() => PaymentMethod)
    @JoinColumn({ name: 'paymentMethodId' })
    paymentMethod!: PaymentMethod;

    @Column()
    settlementYear!: number;

    @Column()
    settlementMonth!: number;

    @Column()
    amount!: number;

    @Column()
    processedAt!: Date;
}