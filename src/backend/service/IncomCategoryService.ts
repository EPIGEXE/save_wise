import { AppDataSource } from "../db/database.js";
import { IncomeCategory } from "../db/entity/IncomeCategory.js";
import { logger } from "../util/logger.js";

export default class IncomeCategoryService {
    private incomeCategoryRepository = AppDataSource.getRepository(IncomeCategory)

    async getAllIncomeCategories(): Promise<IncomeCategory[]> {
        try {
            // logger.info("카테고리 조회 시작");
            return this.incomeCategoryRepository.find();
            // logger.info(`${incomeCategories.length}개의 카테고리 조회 완료`);
        } catch (error) {
            logger.error("카테고리 조회 중 오류 발생", error);
            throw new Error("카테고리를 조회하는 데 실패했습니다.");
        }
    }

    async createIncomeCategory(incomeCategory: IncomeCategory): Promise<IncomeCategory> {
        try {
            // logger.info("카테고리 생성 시작", { data: incomeCategory });
            const { id, ...incomeCategoryWithoutId } = incomeCategory;
            const newIncomeCategory = await this.incomeCategoryRepository.save(incomeCategoryWithoutId);
            // logger.info("카테고리 생성 완료", { id: newIncomeCategory.id });
            return newIncomeCategory;
        } catch (error) {
            logger.error("카테고리 생성 중 오류 발생", error);
            throw new Error("카테고리를 생성하는 데 실패했습니다.");
        }
    }

    async updateIncomeCategory(incomeCategory: IncomeCategory): Promise<void> {
        try {
            // logger.info("카테고리 수정 시작", { data: incomeCategory });
            await this.incomeCategoryRepository.update(incomeCategory.id, incomeCategory);
            // logger.info("카테고리 수정 완료");
        } catch (error) {
            logger.error("카테고리 수정 중 오류 발생", error);
            throw new Error("카테고리를 수정하는 데 실패했습니다.");
        }
    }

    async deleteIncomeCategory(incomeCategory: IncomeCategory): Promise<void> {
        try {
            // logger.info("카테고리 삭제 시작", { id });
            await this.incomeCategoryRepository.delete(incomeCategory.id);
            // logger.info("카테고리 삭제 완료");
        } catch (error) {
            logger.error("카테고리 삭제 중 오류 발생", error);
            throw new Error("카테고리를 삭제하는 데 실패했습니다.");
        }
    }
}