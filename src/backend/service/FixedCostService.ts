import { AppDataSource } from "../db/database.js";
import { FixedCost } from "../db/entity/FixedCost.js";
import { logger } from "../util/logger.js";

export default class FixedCostService {
    private fixedCostRepository = AppDataSource.getRepository(FixedCost)

    async getAllFixedCosts(): Promise<FixedCost[]> {
        try {
             // logger.info("고정비 조회 시작")
             return this.fixedCostRepository.find();
        } catch (error) {
            logger.error("고정비 조회중 오류 발생", error);
            throw new Error("고정비를 조회하는데 실패했습니다.");
        }
    }

    async createFixedCost(fixedCost: FixedCost): Promise<FixedCost> {
        try {
            // logger.info("고정비 생성 시작", {data: fixedCost});
            const {id, ...fixedCostWithoutId} = fixedCost;
            const newFixedCost = await this.fixedCostRepository.save(fixedCostWithoutId);
            return newFixedCost
        } catch (error) {
            logger.error("고정비 생성 중 오류 발생", error);
            throw new Error("고정비를 생성하는데 실패했습니다.");
        }
    }

    async updateFixedCost(fixedCost: FixedCost): Promise<FixedCost> {
        try {
            // logger.info("고정비 수정 시작", {data: fixedCost});
            return this.fixedCostRepository.save(fixedCost);
        } catch (error) {
            logger.error("고정비 수정 중 오류 발생", error);
            throw new Error("고정비를 수정하는데 실패했습니다.");
        }
    }

    async deleteFixedCost(fixedCost: FixedCost): Promise<void> {
        try {
            // logger.info("고정비 삭제 시작", {id});
            await this.fixedCostRepository.delete(fixedCost.id);
        } catch (error) {
            logger.error("고정비 삭제 중 오류 발생", error);
            throw new Error("고정비를 삭제하는데 실패했습니다.");
        }
    }
}