import React, { useEffect, useState } from 'react'
import './App.css'
import { Box, Center, ChakraProvider, Container, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import DefaultLayout from './components/layouts/Default'
import LineChart from './components/LineChart'
import { FaDollarSign, FaPercent, FaChartLine, FaPiggyBank, FaFunnelDollar } from 'react-icons/fa'
import ContextInputNumber from './components/ContextNumberInput'
import InclusiveDebounce from './helper/Debounce'

// Note: This is just for example purposes
// should be replaced with real data from the server
const tempData = {
    xAxis: [0],
    yAxis: [0],
}
const debounce = new InclusiveDebounce(200);

function App() {
    const [dataLoaded, setIsDataLoaded] = useState(false);
    const [plotData, setPlotData] = useState(tempData);
    
    const [apr, setApr] = useState(5);
    const [intialSavings, setInitialSavings] = useState(100);
    const [monthlyTopup, setMonthlyTopup] = useState(10);

    // Error and invalid states
    const [aprInvalid, setAprInvalid] = useState(false);
    const [intialSavingsInvalid, setInitialSavingsInvalid] = useState(false);
    const [monthlyTopupInvalid, setMonthlyTopupInvalid] = useState(false);
    const [isError, setIsError] = useState(false);

    const isInvalidInput = (valueAsString: string) => {
        const num = Number(valueAsString);
        return isNaN(num) || num < 0;
    }

    const handleInitSavingsChange = (valueAsString: string, valueAsNumber: number) => {
        if (isInvalidInput(valueAsString)) {
            setInitialSavingsInvalid(true);
        } else {
            setInitialSavingsInvalid(false);
            setInitialSavings(valueAsNumber);
            handleParamsChange(valueAsNumber, monthlyTopup, apr);
        }
    }
    
    const handleAprChange = (valueAsString: string, valueAsNumber: number) => {
        if (isInvalidInput(valueAsString)) {
            setAprInvalid(true);
        } else {
            setAprInvalid(false);
            setApr(valueAsNumber);
            handleParamsChange(intialSavings, monthlyTopup, valueAsNumber);
        }
    }
    
    const handleMonthlyTopupChange = (valueAsString: string, valueAsNumber: number) => {
        if (isInvalidInput(valueAsString)) {
            setMonthlyTopupInvalid(true);
        } else {
            setMonthlyTopupInvalid(false);
            setMonthlyTopup(valueAsNumber);
            handleParamsChange(intialSavings, valueAsNumber, apr);
        }
    }

    const handleParamsChange = (newIntialSavings: number, newMonthlyTopup: number, newApr: number) => {
        setIsDataLoaded(false);
        debounce.schedule(() => fetchSavingsData(newIntialSavings, newMonthlyTopup, newApr));
    }
    
    const fetchSavingsData = (newIntialSavings: number, newMonthlyTopup: number, newApr: number) => {
        fetch("http://localhost:3001/savings?initialDeposit=" + newIntialSavings + "&monthlyTopup=" + newMonthlyTopup + "&apr=" + newApr)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsDataLoaded(true);
                    
                    const years: number[] = [];
                    const savings: number[] = [];

                    for (let i = 0; i <= 50; i++) {
                        const monthNum = i * 12;
                        if (monthNum > result.savings.length) break;
                        years.push(i);
                        savings.push(result.savings[monthNum]);
                    }

                    // Only need yearly data for plotting
                    setPlotData({
                        xAxis: years,
                        yAxis: savings,
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsDataLoaded(false);
                    setIsError(true);
                }
            )
    }

    useEffect(() => {
        handleParamsChange(intialSavings, monthlyTopup, apr)
    }, [])

    return (
        <ChakraProvider>
            {/* We've just bundled everything into one file here to 
            get you started!*/}
            <DefaultLayout>
                <Container padding={6} maxWidth={'100%'} centerContent>
                    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacingX='40px' spacingY='20px' flex={8}>
                        <ContextInputNumber
                            startContextIcon={FaDollarSign}
                            endContextIcon={FaPiggyBank}
                            endContextText='Initial savings'
                            defaultValue={100}
                            value={intialSavings}
                            onChange={handleInitSavingsChange}
                            step={100}
                            isInvalid={intialSavingsInvalid}
                        />
                        <ContextInputNumber
                            startContextIcon={FaDollarSign}
                            endContextIcon={FaFunnelDollar}
                            endContextText='Monthly deposit'
                            defaultValue={50}
                            value={monthlyTopup}
                            onChange={handleMonthlyTopupChange}
                            step={10}
                            isInvalid={monthlyTopupInvalid}
                        />
                        <ContextInputNumber
                            startContextIcon={FaPercent}
                            endContextIcon={FaChartLine}
                            endContextText='Interest rate (annual)'
                            defaultValue={2}
                            value={apr}
                            onChange={handleAprChange}
                            step={0.5}
                            isInvalid={aprInvalid}
                        />
                    </SimpleGrid>
                    <Box
                        w={{ sm: '100%', xl: '80%' }}
                        paddingTop={6}
                        paddingX={{ sm: 0, md: 4 }}
                    >
                        <Center hidden={!dataLoaded || isError || intialSavingsInvalid || monthlyTopupInvalid || aprInvalid}>
                            <LineChart
                                title="Savings Over time"
                                xAxisData={plotData.xAxis}
                                yAxisData={plotData.yAxis}
                                xLabel="Years"
                                yLabel="Amount"
                            />
                        </Center>
                        <Center hidden={dataLoaded || isError || intialSavingsInvalid || monthlyTopupInvalid || aprInvalid}>
                            <Spinner size='xl' mt={30} />
                        </Center>
                        <Center hidden={! (isError || intialSavingsInvalid || monthlyTopupInvalid || aprInvalid)} mt={30} >
                            <Text color='red'>
                                Error in input or while calculating returns
                            </Text>
                        </Center>
                    </Box>
                </Container>
            </DefaultLayout>
        </ChakraProvider>
    )
}

export default App
