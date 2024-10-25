var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
let PaymentMethod = class PaymentMethod {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], PaymentMethod.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], PaymentMethod.prototype, "type", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], PaymentMethod.prototype, "paymentDay", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "description", void 0);
PaymentMethod = __decorate([
    Entity()
], PaymentMethod);
export { PaymentMethod };
//# sourceMappingURL=PaymentMethod.js.map