export interface AddData {
    id: string;
    timestamp: number;
    value: any;
}
export interface UpdateData {
    id: string;
    value: any;
    timestamp?: number;
}
export declare class IndexedDB {
    db: IDBDatabase | null;
    inited: boolean;
    support: boolean;
    constructor();
    init(): Promise<unknown>;
    read(id: string): Promise<AddData | undefined>;
    add(data: AddData): Promise<unknown> | undefined;
    put(data: UpdateData): Promise<unknown> | undefined;
    remove(id: string): Promise<unknown> | undefined;
    deleteByTimestamp(maxTimestamp: number): Promise<unknown> | undefined;
}
