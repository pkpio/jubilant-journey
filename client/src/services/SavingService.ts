import { SavingsProjectParams } from "../components/SavingsProjectInputs";

export type YearlySavingsData = {
    years: number[],
    savings: number[],
}

const baseUrl = "http://localhost:3001/v1";

export default class SavingService {

    public getProjectedYearlySavings(projectInputs: SavingsProjectParams): Promise<YearlySavingsData> {
        return fetch(`${baseUrl}/projection/savings?initialDeposit=${projectInputs.initialDeposit}&monthlyTopup=${projectInputs.monthlyTopup}&apr=${projectInputs.apr}`)
            .then(res => res.json())
            .then(result => {
                const years: number[] = [];
                const savings: number[] = [];

                for (let i = 0; i <= 50; i++) {
                    const monthNum = i * 12;
                    if (monthNum > result.savings.length) break;
                    years.push(i);
                    savings.push(result.savings[monthNum]);
                }

                return {
                    years: years,
                    savings: savings,
                }
            });
    }
}
