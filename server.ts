import express from "express";
import cors from "cors";

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}
app.use(cors())

const TOTAL_YEARS = 50;
const TOTAL_MONTHS = 12 * TOTAL_YEARS + 1;

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Assumptions
// Interest rate is yearly rate - APR
// Compounded monthly
// Deposits made at the end of the month
app.get('/savings', async (req, res) => {
    const initialDeposit = Number(req.query.initialDeposit);
    const monthlyTopup = Number(req.query.monthlyTopup);
    const apr = Number(req.query.apr); // Annual percentage rate - to be compounded monthly
    const monthlyRate = apr / 12;

    let curPrinciple = initialDeposit;
    let monthlyReturns = {
        month: [] as Number[],
        savings: [] as Number[],
    }
    for (let i = 0; i < TOTAL_MONTHS; i++) {
        monthlyReturns.month.push(i);
        monthlyReturns.savings.push(curPrinciple);
        curPrinciple = curPrinciple + curPrinciple * (monthlyRate / 100) + monthlyTopup;
    }

    // To simulate real backend call delays
    await delay(200);

    res.send(JSON.stringify(monthlyReturns, null, 4));
})

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
