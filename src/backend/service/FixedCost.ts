import { AppDataSource } from "../db/database";
import { FixedCost } from "../db/entity/FixedCost";
import { logger } from "../util/logger";

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
            const newFixedCost = await this.fixedCostRepository.save(fixedCostWithoutId);\
            return newFixedCost
        } catch (error) {
            logger.error("고정비 생성 중 오류 발생", error);
            throw new Error("고정비를 생성하는데 실패했습니다.");
        }
    }
}