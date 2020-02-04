declare type algorithmName = 'FIFO' | 'LRU';
declare type expiredType = number | Date;
interface IAlgorithm {
    name: algorithmName;
    capacity: number;
}
export declare class MCache {
    private algorithmOption;
    private cache;
    private dbInstance;
    private expired;
    constructor(algorithmOption: IAlgorithm, expired?: expiredType);
    /**
     *  @desc  获取缓存中的值
     *  @param  {String}  key  缓存中的key值
     *  @param  {Function | null}  fn  当从缓存和indexedDB中无法获取的时候的调用函数
     *  @param  {expiredType}  expired  对该特定key值设置过期时间
     *
     *  @return {Promise}
     */
    get(key: string, fn?: Function, expired?: expiredType): Promise<any>;
    /**
     *
     * @param {string} key 加入到cache的key值
     * @param {any} value cache的value值
     * @param {expiredType} expired 可以指定相对时间，相对时间最小为0；可以设定绝对时间
     */
    put(key: string, value: any, expired?: expiredType): Promise<void>;
    /**
     * @description 初始化 indexedDB 连接
     */
    init(): Promise<unknown>;
}
export {};
