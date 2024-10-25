import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    amount!: number;

    @Column({ nullable: true })
    description!: string;
}