import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FixedCost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    prospectDay: number;

    @Column()
    amount: number;

    @Column()
    type: "expense" | "income"
}