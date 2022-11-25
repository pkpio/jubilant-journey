export type MonthlySavingsProjection = {
    month: number[],
    savings: number[],
}

export class SavingsProjector {
    public monthlyProjection(
        initialDeposit: number, 
        monthlyTopup: number, 
        apr: number, 
        monthsToProject: number = 12 * 50 + 1,  // 50 years
    ): MonthlySavingsProjection {
        const monthlyRate = apr / 12;
        let curPrinciple = initialDeposit;

        const monthlyReturns = {
            month: [] as number[],
            savings: [] as number[],
        };
        for (let i = 0; i < monthsToProject; i++) {
            monthlyReturns.month.push(i);
            monthlyReturns.savings.push(Number(curPrinciple.toFixed(2)));
            curPrinciple = curPrinciple + curPrinciple * (monthlyRate / 100) + monthlyTopup;
        }

        return monthlyReturns;
    }
}