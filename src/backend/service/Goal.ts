import { AppDataSource } from "../db/database.js";
import { Goal } from "../db/entity/Goal.js";
import { logger } from "../util/logger.js";

export default class GoalService {
    private goalRepository = AppDataSource.getRepository(Goal)

    async getAllGoals(): Promise<Goal[]> {
        try {
            return this.goalRepository.find({
                relations: {
                    expenseCategory: true
                }
            })
        } catch (error) {
            logger.error("목표 조회 중 오류 발생", error)
            throw new Error("목표 조회 실패")
        }
    }

    async createGoal(goal: Goal): Promise<Goal> {
        try {
            // logger.info("목표 생성 시작", { data: goal })
            return this.goalRepository.save(goal)
        } catch (error) {
            logger.error("목표 생성 중 오류 발생", error)
            throw new Error("목표 생성 실패")
        }
    }

    async updateGoal(goal: Goal): Promise<Goal> {
        try {
            // logger.info("목표 수정 시작", { data: goal })
            return this.goalRepository.save(goal)
            // logger.info("목표 수정 완료")
        } catch (error) {
            logger.error("목표 수정 중 오류 발생", error)
            throw new Error("목표 수정 실패")
        }
    }

    async deleteGoal(goal: Goal): Promise<void> {
        try {
            // logger.info("목표 삭제 시작", { id: goal.id })
            await this.goalRepository.delete(goal)
            // logger.info("목표 삭제 완료")
        } catch (error) {
            logger.error("목표 삭제 중 오류 발생", error)
            throw new Error("목표 삭제 실패")
        }
    }
}