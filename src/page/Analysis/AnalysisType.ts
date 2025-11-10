export interface PieActiveShapeProps {
    cx?: number;
    cy?: number;
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    fill?: string;
    payload?: {
        category: string;
        amount: number;
        fixedAmount: number;
        fill?: string;
    };
}

export interface PieLabelProps {
    cx?: number;
    cy?: number;
    x?: number;
    y?: number;
    textAnchor?: string;
    dominantBaseline?: string;
    payload?: {
        category: string;
        amount: number;
    };
}

export interface ChartDataItem {
    category: string;
    amount: number;
    fixedAmount: number;
    fill?: string;
    target?: number;
}