import { IAsset } from "@/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 자산 엔티티
@Entity()
export class Asset implements IAsset {
    @PrimaryGeneratedColumn()
    id!: number; // 자산 ID

    @Column()
    name!: string; // 자산 이름

    @Column()
    amount!: number; // 자산 금액

    @Column({ nullable: true })
    description!: string; // 자산 설명  
}