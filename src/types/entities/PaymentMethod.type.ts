import type { IAsset } from './Asset.type';

// 결제 방법 타입
export interface IPaymentMethod {
    id: number;
    name: string;
    type: "cash" | "credit";
    paymentDay: number | null;
    description: string;
    assetId?: number;
    asset?: IAsset;
}
