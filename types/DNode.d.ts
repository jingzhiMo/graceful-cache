export interface IDNode {
    key: string;
    value: any;
    prev: null | IDNode;
    next: null | IDNode;
}
export declare class DNode implements IDNode {
    key: string;
    value: any;
    next: null | IDNode;
    prev: null | IDNode;
    constructor(key: string, value: any);
}
