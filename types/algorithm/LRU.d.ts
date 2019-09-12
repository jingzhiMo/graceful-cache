export default class LRUCache {
    capacity: number;
    private nowCapacity;
    private cache;
    private head;
    private tail;
    constructor(capacity: number);
    get(key: string): any;
    put(key: string, value: any): void;
}
