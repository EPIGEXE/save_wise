import { DataSource } from "typeorm";
import CreditCardSettlementService from "../service/CreditCardSettlementService.js";
import { logger } from "../util/logger.js";

export default class CreditCardSettlementManager {
    private lastCheckedDate: number;
    private settlementService: CreditCardSettlementService;

    constructor(dataSource: DataSource) {
        this.settlementService = new CreditCardSettlementService(dataSource);
        this.lastCheckedDate = new Date().getDate();
    }

    async initialize() {
        // 앱 시작 시 1회 체크
        const today = new Date();
        await this.processCreditCardSettlement(today.getFullYear(), today.getMonth() + 1);

        // 날짜 변경 감지를 위찬 인터벌
        setInterval(() => this.checkDateChange(), 1000 * 60); // 1분마다 체크
    }

    private async checkDateChange() {
        const currentDate = new Date().getDate();

        if(currentDate !== this.lastCheckedDate) {
            const today = new Date();
            await this.processCreditCardSettlement(today.getFullYear(), today.getMonth() + 1);
            this.lastCheckedDate = currentDate;
        }
    }

    private async processCreditCardSettlement(year: number, month: number): Promise<void> {
        try {
            await this.settlementService.processCreditCardSettlement(year, month);
            logger.info(`신용카드 결제 처리 완료 (${year}년 ${month}월)`);
        } catch (error) {
            logger.error("신용카드 결제 처리 실패", error);
        }
    }

}