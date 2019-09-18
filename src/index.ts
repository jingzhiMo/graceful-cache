import FIFOCache from './algorithm/FIFO'
import LRUCache from './algorithm/LRU'
import { nullValue } from './util/null-value'
import { storageName, getItem, setItem, clearItem, initStorageKey } from './util/storage'

type algorithmName = 'FIFO' | 'LRU'

interface IAlgorithm {
  name: algorithmName,
  capacity: number,
  storage: storageName
}

export class MCache {
  private algorithmOption: IAlgorithm
  private cache: FIFOCache | LRUCache

  constructor(algorithmOption: IAlgorithm) {
    const SelectCache = {
      FIFO: FIFOCache,
      LRU: LRUCache,
    }[algorithmOption.name]

    // TODO 是否需要加载已存在的数据?
    initStorageKey(algorithmOption.storage)
    this.algorithmOption = algorithmOption
    this.cache = new SelectCache(algorithmOption.capacity)
  }

  /**
   *  @desc  获取缓存中的值
   *  @param  {String}  key  缓存中的key值
   *  @param  {Function | null}  fn  当从缓存和storage中无法获取的时候的调用函数
   *
   *  @return {Promise}
   */
  public async get(key: string, fn?: Function): Promise<any> {
    let value: any = this.cache.get(key)

    fn = fn || (() => {})

    if (value !== nullValue) {
      return value
    }

    // 尝试到storage取值
    value = getItem(this.algorithmOption.storage, key)

    if (value !== nullValue) {
      this.cache.put(key, value)
      return value
    }

    // storage 没取到，通过用户提供方法获取
    // 若用户方法没有提供，则为undefined
    value = await fn()

    if (value !== undefined) {
      this.cache.put(key, value)
      setItem(this.algorithmOption.storage, key, value)
    }

    return value
  }

  public put(key: string, value: any): void {
    if (value === undefined) {
      return
    }

    this.cache.put(key, value)
    setItem(this.algorithmOption.storage, key, value)
  }
}

export const clearStorage = clearItem
