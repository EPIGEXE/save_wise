import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "./Asset.js";
import { IPaymentMethod } from "@/types/index.js";

// 결제 방법 엔티티
@Entity()
export class PaymentMethod implements IPaymentMethod {
    @PrimaryGeneratedColumn()
    id!: number; // 결제 방법 ID

    @Column()
    name!: string; // 결제 방법 이름

    @Column()
    type!: "cash" | "credit"; // 결제 방법 유형

    @Column({ type: 'int', nullable: true })
    paymentDay!: number | null; // 결제 날짜

    @Column({ nullable: true })
    description!: string; // 결제 방법 설명

    @Column({ nullable: true })
    assetId?: number; // 자산 ID

    @ManyToOne(() => Asset, { onDelete: 'SET NULL', eager: true, nullable: true })
    @JoinColumn({ name: 'assetId' })
    asset?: Asset; // 자산
}