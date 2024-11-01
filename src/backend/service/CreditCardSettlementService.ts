import { DataSource, IsNull, Not } from "typeorm";
import { AppDataSource } from "../db/database.js";
import { Asset } from "../db/entity/Asset.js";
import { PaymentMethod } from "../db/entity/PaymentMethod.js";
import TransactionService from "./TransactionService.js";
import { CreditCardSettlement } from "../db/entity/CreditCardSettlement.js";
import { logger } from "../util/logger.js";

export default class CreditCardSettlementService {
    private transactionService: TransactionService;
    private paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);
    private assetRepository = AppDataSource.getRepository(Asset);
    private settlementRepository = AppDataSource.getRepository(CreditCardSettlement);

    constructor(dataSource: DataSource) {
        this.transactionService = new TransactionService(dataSource);
    }

    async processCreditCardSettlement(year: number, month: number): Promise<void> {
        try {
            const creditCards = await this.paymentMethodRepository.find({
                where: {
                    type: "credit",
                    assetId: Not(IsNull())
                },
                relations: {
                    asset: true
                }
            });

            // 현재 처리하는 달
            const targetMonth = new Date(year, month - 1);

            for (const card of creditCards) {
                if (!card.paymentDay) continue;

                // 이번달 결제일
                const paymentDate = new Date(year, month - 1, card.paymentDay);

                // 결제일이 없는 날일 경우 (예: 31일이 없는 달)
                // 해당 월의 마지막 날로 조정
                if (paymentDate.getMonth() !== targetMonth.getMonth()) {
                    paymentDate.setDate(0); // 해당 월의 마지막 날로 설정
                }

                const today = new Date();
                if (today >= paymentDate) {
                    const existingSettlement = await this.settlementRepository.findOne({
                        where: {
                            paymentMethodId: card.id,
                            settlementYear: year,
                            settlementMonth: month
                        }
                    });

                    if (!existingSettlement) {
                        await this.processCardSettlement(card, year, month);
                    }
                }
            }
        } catch (error) {
            logger.error(`카드 정산 처리 중 오류 발생: ${error}`);
            throw new Error("신용카드 결제 처리에 실패했습니다.");
        }
    }

    private async processCardSettlement(card: PaymentMethod, year: number, month: number): Promise<void> {
        if(!card.asset || !card.paymentDay) return;

        const { startDate, endDate } = this.calculateBillingPeriod(new Date(year, month - 1));

        const transactions = await this.transactionService.findAllByDateRangeAndPaymentMethod(
            startDate,
            endDate,
            card.id
        );

        const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        await this.updateAssetBalance(card.asset.id, totalAmount);
        
        // 결제 처리 기록 저장
        const settlement = this.settlementRepository.create({
            paymentMethodId: card.id,
            settlementYear: year,
            settlementMonth: month,
            amount: totalAmount,
            processedAt: new Date()
        });
        await this.settlementRepository.save(settlement);
    }

    private calculateBillingPeriod(targetDate: Date) {
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth(); // 0-11

        // 이번달이 3월이면, 2월 1일부터 2월 말일까지 계산되어야 함
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // 1월인 경우 (month = 0) 작년 12월로 조정
        if (month === 0) {
            startDate.setFullYear(year - 1);
            startDate.setMonth(11); // 12월 (0-based)
            
            endDate.setFullYear(year - 1);
            endDate.setMonth(12); // 다음달 0일 = 12월 말일
        }

        return { startDate, endDate };
    }

    private async updateAssetBalance(assetId: number, amount: number): Promise<void> {
        const asset = await this.assetRepository.findOne({ where: { id: assetId }});
        if (asset) {
            asset.amount -= amount;
            await this.assetRepository.save(asset);
        }
    }

}