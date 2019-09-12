import { storageName } from './util/storage';
declare type algorithmName = 'FIFO' | 'LRU';
interface IAlgorithm {
    name: algorithmName;
    capacity: number;
    storage: storageName;
}
export default class Cache {
    private algorithmOption;
    private cache;
    constructor(algorithmOption: IAlgorithm);
    /**
     *  @desc  获取缓存中的值
     *  @param  {String}  key  缓存中的key值
     *  @param  {Function}  fn  当从缓存和storage中无法获取的时候的调用函数
     *
     *  @return {Promise}
     */
    get(key: string, fn: Function): Promise<any>;
    put(key: string, value: any): void;
}
export {};
