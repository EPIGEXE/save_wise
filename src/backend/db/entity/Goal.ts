import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Goal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    targetAmount!: number;
    
    @Column({ nullable: true })
    expenseCategoryId?: number;

    @ManyToOne('ExpenseCategory', 'goals', {
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'expenseCategoryId' })
    expenseCategory?: any;
}