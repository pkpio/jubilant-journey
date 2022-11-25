import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import LineChart from "./LineChart";

export type LineChartWithStatusProps = {
    xAxisData: number[],
    yAxisData: number[],
    xLabel: string,
    yLabel: string,
    title: string,
    isDataLoading: boolean,
    hasErrors: boolean,
    errorMessage?: string,
}

function LineChartWithStatus(props: LineChartWithStatusProps) {
    return (
        <Box
            w={{ sm: '100%', xl: '80%' }}
            paddingTop={6}
            paddingX={{ sm: 0, md: 4 }}
        >
            <Center hidden={props.isDataLoading || props.hasErrors}>
                <LineChart
                    title="Savings Over time"
                    xAxisData={props.xAxisData}
                    yAxisData={props.yAxisData}
                    xLabel={props.xLabel}
                    yLabel={props.yLabel}
                />
            </Center>
            <Center hidden={!props.isDataLoading}>
                <Spinner size='xl' mt={30} />
            </Center>
            <Center hidden={!props.hasErrors} mt={30} >
                <Text color='red'>
                    Error in inputs or getting data: { props.errorMessage }
                </Text>
            </Center>
        </Box>
    )
}

export default LineChartWithStatus;
