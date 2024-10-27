import { AppDataSource } from "../db/database.js";
import { ExpenseCategory } from "../db/entity/ExpenseCategory.js";
import { logger } from "../util/logger.js";
export default class ExpenseCategoryService {
    constructor() {
        this.expenseCategoryRepository = AppDataSource.getRepository(ExpenseCategory);
    }
    async getAllExpenseCategories() {
        try {
            // logger.info("카테고리 조회 시작");
            return this.expenseCategoryRepository.find();
            // logger.info(`${expenseCategories.length}개의 카테고리 조회 완료`);
        }
        catch (error) {
            logger.error("카테고리 조회 중 오류 발생", error);
            throw new Error("카테고리를 조회하는 데 실패했습니다.");
        }
    }
    async createExpenseCategory(expenseCategory) {
        try {
            // logger.info("카테고리 생성 시작", { data: expenseCategory });
            const newExpenseCategory = await this.expenseCategoryRepository.save(expenseCategory);
            // logger.info("카테고리 생성 완료", { id: newExpenseCategory.id });
            return newExpenseCategory;
        }
        catch (error) {
            logger.error("카테고리 생성 중 오류 발생", error);
            throw new Error("카테고리를 생성하는 데 실패했습니다.");
        }
    }
    async updateExpenseCategory(expenseCategory) {
        try {
            // logger.info("카테고리 수정 시작", { data: expenseCategory });
            await this.expenseCategoryRepository.update(expenseCategory.id, expenseCategory);
            // logger.info("카테고리 수정 완료");
        }
        catch (error) {
            logger.error("카테고리 수정 중 오류 발생", error);
            throw new Error("카테고리를 수정하는 데 실패했습니다.");
        }
    }
    async deleteExpenseCategory(id) {
        try {
            // logger.info("카테고리 삭제 시작", { id });
            await this.expenseCategoryRepository.delete(id);
            // logger.info("카테고리 삭제 완료");
        }
        catch (error) {
            logger.error("카테고리 삭제 중 오류 발생", error);
            throw new Error("카테고리를 삭제하는 데 실패했습니다.");
        }
    }
}
//# sourceMappingURL=ExpenseCategory.js.map