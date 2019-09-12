export default class FIFOCache {
    private cache;
    private head;
    private tail;
    private nowCapacity;
    private capacity;
    constructor(capacity: number);
    get(key: string): any;
    put(key: string, value: any): void;
}
