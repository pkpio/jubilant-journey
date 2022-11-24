import { Icon, InputGroup, InputLeftAddon, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from 'react-icons/lib'

type ContextInputProps = {
    startContextText?: string,
    startContextIcon: IconType,
    endContextText?: string,
    endContextIcon: IconType,
    defaultValue: number,
    minValue?: number,
    value: number,
    step?: number,
    isInvalid: boolean,
    onChange: (valueAsString: string, valueAsNumber: number) => void,
}

const ContextInputNumber = ({ 
    startContextText, 
    startContextIcon, 
    endContextText, 
    endContextIcon, 
    defaultValue, 
    minValue = 0,
    onChange,
    isInvalid,
    step = 0.2 
}: ContextInputProps) => {
    return (
        <InputGroup>
            <InputLeftAddon 
                children={
                    <>
                        <Icon as={startContextIcon} />
                        <Text>{startContextText}</Text>
                    </>
                }
            />
            <NumberInput
                defaultValue={defaultValue}
                min={minValue}
                clampValueOnBlur={false}
                step={step}
                isInvalid={isInvalid}
                onChange={onChange}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <InputRightAddon 
                children={
                    <>
                        <Icon as={endContextIcon} />
                        <Text paddingLeft={2}>{endContextText}</Text> 
                    </>
                }
            />
        </InputGroup>
    )
}

export default ContextInputNumber;