import { AppDataSource } from "../db/database.js";
import { PaymentMethod } from "../db/entity/PaymentMethod.js";
import { logger } from "../util/logger.js";
export default class PaymentMethodService {
    constructor() {
        this.paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);
    }
    async getAllPaymentMethod() {
        try {
            // logger.info("결제 방법 목록 조회 시작");
            const paymentMethods = await this.paymentMethodRepository.find();
            // logger.info(`${paymentMethods.length}개의 결제 방법 조회 완료`);
            return paymentMethods;
        }
        catch (error) {
            logger.error("결제 방법 목록 조회 중 오류 발생", error);
            throw new Error("결제 방법 목록을 가져오는 데 실패했습니다.");
        }
    }
    async createPaymentMethod(paymentMethod) {
        try {
            // logger.info("새 결제 방법 생성 시작", { data: paymentMethod });
            const newPaymentMethod = await this.paymentMethodRepository.save(paymentMethod);
            // logger.info("새 결제 방법 생성 완료", { id: newPaymentMethod.id });
            return newPaymentMethod;
        }
        catch (error) {
            logger.error("결제 방법 생성 중 오류 발생", error);
            throw new Error("새 결제 방법을 생성하는 데 실패했습니다.");
        }
    }
    async updatePaymentMethod(paymentMethod) {
        try {
            // logger.info("결제 방법 수정 시작", { data: paymentMethod });
            await this.paymentMethodRepository.update(paymentMethod.id, paymentMethod);
            // logger.info("결제 방법 수정 완료", { id: paymentMethod.id });
        }
        catch (error) {
            logger.error("결제 방법 수정 중 오류 발생", error);
            throw new Error("결제 방법을 수정하는 데 실패했습니다.");
        }
    }
    async deletePaymentMethod(paymentMethod) {
        try {
            // logger.info("결제 방법 삭제 시작", { id: paymentMethod.id });
            await this.paymentMethodRepository.delete(paymentMethod.id);
            // logger.info("결제 방법 삭제 완료", { id: paymentMethod.id });
        }
        catch (error) {
            logger.error("결제 방법 삭제 중 오류 발생", error);
            throw new Error("결제 방법을 삭제하는 데 실패했습니다.");
        }
    }
}
//# sourceMappingURL=PaymentMethod.js.map