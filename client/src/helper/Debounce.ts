type CallbackFn = () => void;

/**
 * Helper class to avoid running a function too frequently. Use this to rate limit a function.
 * Users of this class can schedule callbacks to run after a threshold amount of time. If user schedules
 * a new callback before the threshold time has elapsed, then we cancel the last callback and schedule the 
 * latest one. 
 */
 export default class Debounce {
    // Time in between triggers of the callback (in milliseconds)
    private threshold: number;
    
    // Last time this function was triggered
    private lastTrigger: number = 0;
    
    // Timeout for a previously scheduled callback
    private timeout: NodeJS.Timeout | void = undefined;
    
    public constructor(threshold: number) {
        this.threshold = threshold;
    }

    /**
     * Schedule a callback with debouncing
     */
    public schedule(callback: CallbackFn): void {
        const now: number = Date.now();
        const diff: number = now - this.lastTrigger;
        
        // Cancel any past scheduled callback, if exists
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        if (diff > this.threshold) {
            // Execute Immediately if time elapsed since last schedule is higher than threshold
            this.lastTrigger = now;
            callback();
        } else {
            // Create future event
            this.timeout = setTimeout(callback, this.threshold);
        }
    }
}