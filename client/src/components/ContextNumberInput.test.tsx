import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ContextInputNumber from './ContextNumberInput';
import { FaLaugh, FaSmile } from 'react-icons/fa';

describe('App page', () => {
    const props = {
        startContextIcon: FaSmile,
        endContextIcon: FaLaugh,
        startContextText: 'Start',
        endContextText: 'End',
        defaultValue: 42,
        onChange: jest.fn(),
        isInvalid: false,
    }
    
    test('Renders default value', () => {
        render(<ContextInputNumber {...props} />);
        expect(screen.getByDisplayValue(/42/i)).toBeInTheDocument();
    });
    
    test('Renders start context', () => {
        render(<ContextInputNumber {...props} />);
        expect(screen.getByText(props.startContextText)).toBeInTheDocument();
    });
    
    test('Renders end context', () => {
        render(<ContextInputNumber {...props} />);
        expect(screen.getByText(props.endContextText)).toBeInTheDocument();
    });
    
    test('Changing input calls onChange', () => {
        render(<ContextInputNumber {...props} />);
        const input = screen.getByDisplayValue(/42/i);
        fireEvent.change(input, {target: { value: 43 }});

        expect(props.onChange.mock.calls.length).toBe(1);
    });
    
})

