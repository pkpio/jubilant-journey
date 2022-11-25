import { SimpleGrid } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FaDollarSign, FaPiggyBank, FaFunnelDollar, FaPercent, FaChartLine } from "react-icons/fa"
import ContextInputNumber from "./ContextNumberInput"

export type SavingsProjectParams = {
    initialDeposit: number,
    monthlyTopup: number,
    apr: number,
}

export type SavingsProjectInputsProps = {
    inputsChangeHandler: (inputs: SavingsProjectParams) => void,
    inputsErrorHandler: (errorMessage: string) => void,
    inputsErrorClearHandler: () => void,
}

function SavingsProjectInputs(props: SavingsProjectInputsProps) {
    const [projectParams, setProjectParams] = useState<SavingsProjectParams>({
        initialDeposit: 100,
        monthlyTopup: 50,
        apr: 2,
    });

    // Error and invalid states
    const [isInitialDepositInvalid, setIsInitialDepositInvalid] = useState(false);
    const [isMonthlyTopupInvalid, setMonthlyTopupInvalid] = useState(false);
    const [isAprInvalid, setIsAprInvalid] = useState(false);

    const isInvalidInput = (valueAsString: string) => {
        const num = Number(valueAsString);
        return isNaN(num) || num < 0;
    }

    const handleParamsChange = ({
        initialDeposit = projectParams.initialDeposit, 
        monthlyTopup = projectParams.monthlyTopup, 
        apr = projectParams.apr,
    }) => {
        const newParams = {
            initialDeposit: initialDeposit,
            monthlyTopup: monthlyTopup,
            apr: apr,
        };
        setProjectParams(newParams);
        props.inputsChangeHandler(newParams);
    }

    const reportInputErrorsState = () => {
        if (isInitialDepositInvalid || isMonthlyTopupInvalid || isAprInvalid) {
            props.inputsErrorHandler("There are errors in the inputs. Please check!");
        } else {
            props.inputsErrorClearHandler();
        }
    }

    const handleInitialDepositChange = (valueAsString: string, valueAsNumber: number) => {
        if (isInvalidInput(valueAsString)) {
            setIsInitialDepositInvalid(true);
        } else {
            setIsInitialDepositInvalid(false);
            handleParamsChange({ initialDeposit: valueAsNumber });
        }
        reportInputErrorsState();
    }
    
    const handleMonthlyTopupChange = (valueAsString: string, valueAsNumber: number) => {
        if (isInvalidInput(valueAsString)) {
            setMonthlyTopupInvalid(true);
        } else {
            setMonthlyTopupInvalid(false);
            handleParamsChange({ monthlyTopup: valueAsNumber });
        }
        reportInputErrorsState();
    }
    
    const handleAprChange = (valueAsString: string, valueAsNumber: number) => {
        if (isInvalidInput(valueAsString)) {
            setIsAprInvalid(true);
        } else {
            setIsAprInvalid(false);
            handleParamsChange({ apr: valueAsNumber });
        }
        reportInputErrorsState();
    }
    
    useEffect(() => { handleParamsChange({}) }, []);
    
    return (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacingX='40px' spacingY='20px' flex={8}>
            <ContextInputNumber
                startContextIcon={FaDollarSign}
                endContextIcon={FaPiggyBank}
                endContextText='Initial savings'
                defaultValue={100}
                onChange={handleInitialDepositChange}
                step={100}
                isInvalid={isInitialDepositInvalid}
            />
            <ContextInputNumber
                startContextIcon={FaDollarSign}
                endContextIcon={FaFunnelDollar}
                endContextText='Monthly deposit'
                defaultValue={50}
                onChange={handleMonthlyTopupChange}
                step={10}
                isInvalid={isMonthlyTopupInvalid}
            />
            <ContextInputNumber
                startContextIcon={FaPercent}
                endContextIcon={FaChartLine}
                endContextText='Interest rate (annual)'
                defaultValue={2}
                onChange={handleAprChange}
                step={0.5}
                isInvalid={isAprInvalid}
            />
        </SimpleGrid>
    )
}

export default SavingsProjectInputs;