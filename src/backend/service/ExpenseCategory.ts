import { AppDataSource } from "../db/database.js";
import { ExpenseCategory } from "../db/entity/ExpenseCategory.js";
import { Goal } from "../db/entity/Goal.js";
import { logger } from "../util/logger.js";

export default class ExpenseCategoryService {
    private expenseCategoryRepository = AppDataSource.getRepository(ExpenseCategory)
    private goalRepository = AppDataSource.getRepository(Goal)

    async getAllExpenseCategories(): Promise<ExpenseCategory[]> {
        try {
            // logger.info("카테고리 조회 시작");
            return this.expenseCategoryRepository.find();
        } catch (error) {
            logger.error("카테고리 조회 중 오류 발생", error);
            throw new Error("카테고리를 조회하는 데 실패했습니다.");
        }
    }

    async createExpenseCategory(expenseCategory: ExpenseCategory): Promise<ExpenseCategory> {
        try {
            const result = await AppDataSource.transaction(async transactionalEntityManager => {
                // 카테고리 생성
                const { id, ...expenseCategoryWithoutId } = expenseCategory;
                const newExpenseCategory = await transactionalEntityManager.save(ExpenseCategory, expenseCategoryWithoutId);

                const autoGoal = this.goalRepository.create({
                    name: `${newExpenseCategory.name} 지출 목표`,
                    targetAmount: 0,
                    expenseCategoryId: newExpenseCategory.id,
                });

                await transactionalEntityManager.save(Goal, autoGoal);
                return newExpenseCategory;
            });

            return result;
        } catch (error) {
            logger.error("카테고리 생성 중 오류 발생", error);
            throw new Error("카테고리를 생성하는 데 실패했습니다.");
        }
    }

    async updateExpenseCategory(expenseCategory: ExpenseCategory): Promise<void> {
        try {
            // logger.info("카테고리 수정 시작", { data: expenseCategory });
            await this.expenseCategoryRepository.update(expenseCategory.id, expenseCategory);
            // logger.info("카테고리 수정 완료");
        } catch (error) {
            logger.error("카테고리 수정 중 오류 발생", error);
            throw new Error("카테고리를 수정하는 데 실패했습니다.");
        }
    }

    async deleteExpenseCategory(expenseCategory: ExpenseCategory): Promise<void> {
        try {
            // logger.info("카테고리 삭제 시작", { id });
            await this.expenseCategoryRepository.delete(expenseCategory.id);
            // logger.info("카테고리 삭제 완료");
        } catch (error) {
            logger.error("카테고리 삭제 중 오류 발생", error);
            throw new Error("카테고리를 삭제하는 데 실패했습니다.");
        }
    }
}