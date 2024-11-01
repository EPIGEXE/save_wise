import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "./Asset.js";

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    type!: "cash" | "credit";

    @Column({ type: 'int', nullable: true })
    paymentDay!: number | null;

    @Column({ nullable: true })
    description!: string;

    @Column({ nullable: true })
    assetId?: number;

    @ManyToOne(() => Asset, { onDelete: 'SET NULL', eager: true, nullable: true })
    @JoinColumn({ name: 'assetId' })
    asset?: Asset;
}