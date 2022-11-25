import { wait } from '@testing-library/user-event/dist/utils';
import Debounce from './Debounce';

describe('Debounce', () => {
    const threshold = 1000;

    let debounce: Debounce;
    let mockCallback: jest.Mock;

    beforeEach(() => {
        debounce = new Debounce(threshold);
        mockCallback = jest.fn();
    })
    
    test('Schedules straight away on first call', async () => {
        debounce.schedule(mockCallback);
        expect(mockCallback.mock.calls.length).toBe(1)
    });
    
    test('Schedules only first call right away', async () => {
        debounce.schedule(mockCallback);
        debounce.schedule(mockCallback);
        expect(mockCallback.mock.calls.length).toBe(1)
    });
    
    test('Schedules both calls eventually', async () => {
        debounce.schedule(mockCallback);
        debounce.schedule(mockCallback);
        await wait(threshold);
        expect(mockCallback.mock.calls.length).toBe(2)
    });
    
    test('Skips frequent calls', async () => {
        debounce.schedule(mockCallback);
        debounce.schedule(mockCallback);
        debounce.schedule(mockCallback);
        debounce.schedule(mockCallback);
        debounce.schedule(mockCallback);
        await wait(threshold);
        expect(mockCallback.mock.calls.length).toBe(2)
    });
    
})
