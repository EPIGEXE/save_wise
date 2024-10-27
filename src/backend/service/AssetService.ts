import { AppDataSource } from "../db/database.js";
import { Asset } from "../db/entity/Asset.js";
import { logger } from "../util/logger.js";

export default class AssetService {
    private assetRepository = AppDataSource.getRepository(Asset)

    async getAllAssets(): Promise<Asset[]> {
        try {
            // logger.info("자산 목록 조회 시작");
            return this.assetRepository.find();
            // logger.info(`${assets.length}개의 자산 조회 완료`);
        } catch (error) {
            logger.error("자산 목록 조회 중 오류 발생", error);
            throw new Error("자산 목록을 가져오는 데 실패했습니다.");
        }
    }

    async createAsset(asset: Asset): Promise<Asset> {
        try {
            // logger.info("새 자산 생성 시작", { data: asset });
            const newAsset = await this.assetRepository.save(asset);
            // logger.info("새 자산 생성 완료", { id: newAsset.id });
            return newAsset;
        } catch (error) {
            logger.error("자산 생성 중 오류 발생", error);
            throw new Error("자산을 생성하는 데 실패했습니다.");
        }
    }

    async updateAsset(asset: Asset): Promise<void> {
        try {
            // logger.info("자산 수정 시작", { data: asset });
            await this.assetRepository.update(asset.id, asset);
            // logger.info("자산 수정 완료", { id: asset.id });
        } catch (error) {
            logger.error("자산 수정 중 오류 발생", error);
            throw new Error("자산을 수정하는 데 실패했습니다.");
        }
    }

    async deleteAsset(asset: Asset): Promise<void> {
        try {
            // logger.info("자산 삭제 시작", { id: asset.id });
            await this.assetRepository.delete(asset.id);
            // logger.info("자산 삭제 완료", { id: asset.id });
        } catch (error) {
            logger.error("자산 삭제 중 오류 발생", error);
            throw new Error("자산을 삭제하는 데 실패했습니다.");
        }
    }
}