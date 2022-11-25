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
    step?: number,
    isInvalid: boolean,
    onChange: (valueAsString: string, valueAsNumber: number) => void,
}

const ContextInputNumber = (props: ContextInputProps) => {
    return (
        <InputGroup>
            <InputLeftAddon 
                children={
                    <>
                        <Icon as={props.startContextIcon} />
                        <Text>{props.startContextText}</Text>
                    </>
                }
            />
            <NumberInput
                defaultValue={props.defaultValue}
                min={props.minValue}
                clampValueOnBlur={false}
                step={props.step}
                isInvalid={props.isInvalid}
                onChange={props.onChange}
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
                        <Icon as={props.endContextIcon} />
                        <Text paddingLeft={2}>{props.endContextText}</Text> 
                    </>
                }
            />
        </InputGroup>
    )
}

export default ContextInputNumber;