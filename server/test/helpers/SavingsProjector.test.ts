import { expect, describe, beforeEach, it } from "@jest/globals";
import { SavingsProjector } from "../../src/helpers/SavingsProjector";

describe("SavingsProjector", () => {
    const initialDeposit = 100;
    const monthlyTopup = 10;
    const apr = 5;

    let savingsProjector: SavingsProjector;

    beforeEach(() => {
        savingsProjector = new SavingsProjector();
    });

    it("Should contain 50 years of projections", async () => {
        const monthsInProjection = 50 * 12 + 1;
        const projection = savingsProjector.monthlyProjection(
            initialDeposit, monthlyTopup, apr, monthsInProjection,
        );

        expect(projection.month.length).toBe(monthsInProjection);
        expect(projection.savings.length).toBe(monthsInProjection);
    });

    it("Should contain number for every month", async () => {
        const monthsInProjection = 6;
        const projection = savingsProjector.monthlyProjection(
            initialDeposit, monthlyTopup, apr, monthsInProjection,
        );

        expect(projection.month).toStrictEqual([0, 1, 2, 3, 4, 5]);
    });

    it("Should contain savings for month", async () => {
        const monthsInProjection = 6;
        const projection = savingsProjector.monthlyProjection(
            initialDeposit, monthlyTopup, apr, monthsInProjection,
        );

        expect(projection.savings).toStrictEqual([100, 110.42, 120.88, 131.38, 141.93, 152.52]);
    });
});