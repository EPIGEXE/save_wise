import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    type!: "cash" | "credit";

    @Column({ type: 'int', nullable: true })
    paymentDay!: number;

    @Column({ nullable: true })
    description!: string;
}