import FIFOCache from './algorithm/FIFO'
import LRUCache from './algorithm/LRU'
import { nullValue } from './util/null-value'
import {
  IndexedDB
} from './util/indexedDB'

type algorithmName = 'FIFO' | 'LRU'
// 默认的过期时间，30分钟
let DEFAULT_EXPIRED = 30 * 60 * 1000

interface IAlgorithm {
  name: algorithmName
  capacity: number
}

/**
 * @description 根据绝对日期或相对时间生成最终的时间戳
 * @param {number | Date} expired 可以指定相对时间，相对时间最小为0；可以设定绝对时间
 */
function generateTimestamp(expired?: number | Date): number {
  let timestamp

  if (expired instanceof Date) {
    timestamp = +expired
  } else if (typeof expired === 'number' && expired >= 0) {
    timestamp = Date.now() + expired
  } else {
    timestamp = Date.now() + DEFAULT_EXPIRED
  }

  return timestamp
}

export class MCache {
  private algorithmOption: IAlgorithm
  private cache: FIFOCache | LRUCache
  private dbInstance: IndexedDB
  private expired: number

  constructor(algorithmOption: IAlgorithm, expired: number) {
    const SelectCache = {
      FIFO: FIFOCache,
      LRU: LRUCache,
    }[algorithmOption.name]

    this.algorithmOption = algorithmOption
    this.cache = new SelectCache(algorithmOption.capacity)
    // 默认过期时间为30分钟后
    this.expired = expired
    this.dbInstance = new IndexedDB()
    this.dbInstance.init()
  }

  /**
   *  @desc  获取缓存中的值
   *  @param  {String}  key  缓存中的key值
   *  @param  {Function | null}  fn  当从缓存和indexedDB中无法获取的时候的调用函数
   *
   *  @return {Promise}
   */
  public async get(key: string, fn?: Function): Promise<any> {
    let value: any = this.cache.get(key)

    fn = fn || (() => ({}))
    // 异步触发删除过期数据
    this.dbInstance.deleteByTimestamp(Date.now())

    if (value !== nullValue) {
      return value
    }

    // 尝试到 indexedDB 取值
    const result = await this.dbInstance.read(key)

    if (result) {
      if (result.timestamp > Date.now()) {
        return result.value
      } else {
        // 删除过期数据
        await this.dbInstance.remove(key)
      }
    }

    // indexedDB 没取到，通过用户提供方法获取
    // 若用户方法没有提供，则为undefined
    try {
      value = await fn()
    } catch (e) {
      throw new Error('excute request function error' + e)
    }

    if (value !== undefined) {
      this.cache.put(key, value)
      this.dbInstance.add({
        id: key,
        value,
        timestamp: generateTimestamp(this.expired)
      })
    }

    return value
  }

  /**
   *
   * @param {string} key 加入到cache的key值
   * @param {any} value cache的value值
   * @param {number | Date} expired 可以指定相对时间，相对时间最小为0；可以设定绝对时间
   */
  public async put(key: string, value: any, expired?: number | Date): void {
    if (value === undefined) {
      return
    }

    this.cache.put(key, value)
    const result = await this.dbInstance.read(key)

    // 没有存在数据
    if (!result) {
      await this.dbInstance.add({
        id: key,
        value,
        timestamp: generateTimestamp(expired || this.expired)
      })
    } else {
      await this.dbInstance.put({
        id: key,
        value
      })
    }

    // 触发删除过期数据
    this.dbInstance.deleteByTimestamp(Date.now())
  }
}
