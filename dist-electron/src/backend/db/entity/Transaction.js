var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "./PaymentMethod.js";
import { IncomeCategory } from "./IncomeCategory.js";
import { ExpenseCategory } from "./ExpenseCategory.js";
let Transaction = class Transaction {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Transaction.prototype, "date", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    ManyToOne(() => PaymentMethod, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'paymentMethodId' }),
    __metadata("design:type", PaymentMethod)
], Transaction.prototype, "paymentMethod", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "paymentMethodId", void 0);
__decorate([
    ManyToOne(() => IncomeCategory, category => category.transactions, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'incomeCategoryId' }),
    __metadata("design:type", IncomeCategory)
], Transaction.prototype, "incomeCategory", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "incomeCategoryId", void 0);
__decorate([
    ManyToOne(() => ExpenseCategory, category => category.transactions, { onDelete: 'SET NULL' }),
    JoinColumn({ name: 'expenseCategoryId' }),
    __metadata("design:type", ExpenseCategory)
], Transaction.prototype, "expenseCategory", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "expenseCategoryId", void 0);
Transaction = __decorate([
    Entity()
], Transaction);
export { Transaction };
//# sourceMappingURL=Transaction.js.map