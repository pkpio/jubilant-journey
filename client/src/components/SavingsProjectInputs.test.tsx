import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SavingsProjectInputs from './SavingsProjectInputs';

describe('SavingsProjectInputs', () => {
    let mockInputChange: jest.Mock;
    let mockErrorHandler: jest.Mock;
    let mockErrorClearHandler: jest.Mock;

    beforeEach(() => {
        mockInputChange = jest.fn();
        mockErrorHandler = jest.fn();
        mockErrorClearHandler = jest.fn();
        
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(
            <SavingsProjectInputs
                inputsChangeHandler={mockInputChange}
                inputsErrorHandler={mockErrorHandler}
                inputsErrorClearHandler={mockErrorClearHandler}
            />
        );
    })
    
    test('Renders initial savings element', () => {
        expect(screen.getByText(/Initial savings/i)).toBeInTheDocument();
    });
    
    test('Renders monthly deposit element', () => {
        expect(screen.getByText(/Monthly deposit/i)).toBeInTheDocument();
    });
    
    test('Renders interest rate element', () => {
        expect(screen.getByText(/Interest rate/i)).toBeInTheDocument();
    });
    
    test('Changing initial deposit calls change handler', () => {
        const input = screen.getByDisplayValue(/100/i);
        fireEvent.change(input, {target: { value: 43 }});

        // Once for setting defaults and the other for new value
        expect(mockInputChange.mock.calls.length).toBe(2);
        expect(mockInputChange.mock.calls[1][0]).toStrictEqual({
            "initialDeposit": 43,
            "monthlyTopup": 50,
            "apr": 2,
        });
    });
    
    test('Changing monthlyTopup calls change handler', () => {
        const input = screen.getByDisplayValue(/50/i);
        fireEvent.change(input, {target: { value: 43 }});

        // Once for setting defaults and the other for new value
        expect(mockInputChange.mock.calls.length).toBe(2);
        expect(mockInputChange.mock.calls[1][0]).toStrictEqual({
            "initialDeposit": 100,
            "monthlyTopup": 43,
            "apr": 2,
        });
    });
    
    test('Changing apr calls change handler', () => {
        const input = screen.getByDisplayValue(/2/i);
        fireEvent.change(input, {target: { value: 43 }});

        // Once for setting defaults and the other for new value
        expect(mockInputChange.mock.calls.length).toBe(2);
        expect(mockInputChange.mock.calls[1][0]).toStrictEqual({
            "initialDeposit": 100,
            "monthlyTopup": 50,
            "apr": 43,
        });
    });
    
})

