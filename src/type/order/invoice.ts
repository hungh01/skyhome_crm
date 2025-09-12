export interface Invoice {
    initialFee: number;
    finalFee: number;
    totalFee: number;
    platformFee: number;
    workShiftDeposit: number;
    remainingShiftDeposit: number;
    shiftIncome: number;
    netIncome: number;
    totalDiscount: number;
    totalTime: number;
}