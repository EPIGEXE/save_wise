import { Column, JoinColumn, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";

// 신용카드 결제 처리 엔티티
@Entity()
export class CreditCardSettlement {
    @PrimaryGeneratedColumn()
    id!: number; // 신용카드 결제 처리 ID

    @Column()
    paymentMethodId!: number; // 결제 방법 ID

    @ManyToOne(() => PaymentMethod)
    @JoinColumn({ name: 'paymentMethodId' })
    paymentMethod!: PaymentMethod; // 결제 방법

    @Column()
    settlementYear!: number; // 결제 처리 연도

    @Column()
    settlementMonth!: number; // 결제 처리 월

    @Column()
    amount!: number; // 결제 처리 금액

    @Column()
    processedAt!: Date; // 결제 처리 날짜
}