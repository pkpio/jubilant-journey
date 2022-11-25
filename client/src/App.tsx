import React, { useState } from 'react'
import './App.css'
import { ChakraProvider, Container } from '@chakra-ui/react'
import Debounce from './helper/Debounce'
import LineChartWithStatus from './components/LineChartWithStatus'
import SavingsProjectInputs, { SavingsProjectParams } from './components/SavingsProjectInputs'
import DefaultLayout from './components/layouts/Default'
import SavingService from './services/SavingService'

export type AppParams = {
    debounce: Debounce,
    savingService: SavingService,
} 

function App(props: AppParams) {
    const [serviceReqPending, setIsServiceReqPending] = useState(false);
    const [inputErrors, setInputErrors] = useState(false);
    const [serviceError, setServiceError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [plotData, setPlotData] = useState({ xAxis: [0], yAxis: [0]});
  

    const handleParamsChange = (projectInputs: SavingsProjectParams) => {
        setIsServiceReqPending(true);
        props.debounce.schedule(() => fetchSavingsData(projectInputs));
    }
    
    const fetchSavingsData = (projectInputs: SavingsProjectParams) => {
        props.savingService.getProjectedYearlySavings(projectInputs)
            .then(savingsData => setPlotData({
                xAxis: savingsData.years,
                yAxis: savingsData.savings,
            }))
            .catch(err => {
                setServiceError(true);
                setErrorMessage(`Error fetching data from remote service: ${err}`);
            })
            .finally(() => setIsServiceReqPending(false));
    }

    return (
        <ChakraProvider>
            <DefaultLayout>
                <Container padding={6} maxWidth={'100%'} centerContent>
                    <SavingsProjectInputs 
                        inputsChangeHandler={(projectInputs) => handleParamsChange(projectInputs)}
                        inputsErrorHandler={(err) => {
                            setInputErrors(true);
                            setErrorMessage(err);
                        }}
                        inputsErrorClearHandler={() => setInputErrors(false)}
                    />
                    <LineChartWithStatus 
                        xAxisData={plotData.xAxis}
                        yAxisData={plotData.yAxis}
                        xLabel="Years"
                        yLabel="Amount"
                        title="Savings Over time"
                        isDataLoading={serviceReqPending} 
                        hasErrors={inputErrors || serviceError}
                        errorMessage={errorMessage}
                    />
                </Container>
            </DefaultLayout>
        </ChakraProvider>
    )
}

export default App
