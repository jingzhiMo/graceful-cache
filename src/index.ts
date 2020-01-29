import FIFOCache from './algorithm/FIFO'
import LRUCache from './algorithm/LRU'
import { nullValue } from './util/null-value'
import {
  IndexedDB
} from './util/indexedDB'

type algorithmName = 'FIFO' | 'LRU'
type expiredType = number | Date
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
function generateTimestamp(expired?: expiredType): number {
  let timestamp

  if (expired instanceof Date) {
    timestamp = +expired
  } else if (typeof expired === 'number' && expired > 0) {
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
  private expired: expiredType

  constructor(algorithmOption: IAlgorithm, expired?: expiredType) {
    const SelectCache = {
      FIFO: FIFOCache,
      LRU: LRUCache,
    }[algorithmOption.name]

    this.algorithmOption = algorithmOption
    this.cache = new SelectCache(algorithmOption.capacity)
    // 默认过期时间为30分钟后
    this.expired = expired || 0
    this.dbInstance = new IndexedDB()
  }

  /**
   *  @desc  获取缓存中的值
   *  @param  {String}  key  缓存中的key值
   *  @param  {Function | null}  fn  当从缓存和indexedDB中无法获取的时候的调用函数
   *  @param  {expiredType}  expired  对该特定key值设置过期时间
   *
   *  @return {Promise}
   */
  public async get(key: string, fn?: Function, expired?: expiredType): Promise<any> {
    let value: any = this.cache.get(key)

    fn = fn || (() => nullValue)
    // 异步触发删除过期数据
    this.dbInstance.deleteByTimestamp(Date.now())

    if (value !== nullValue) {
      return value
    }

    // 尝试到 indexedDB 取值
    const result = await this.dbInstance.read(key)

    if (result) {
      if (result.timestamp > Date.now()) {
        this.cache.put(key, result.value)
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
        timestamp: generateTimestamp(expired || this.expired)
      })
    }

    return value
  }

  /**
   *
   * @param {string} key 加入到cache的key值
   * @param {any} value cache的value值
   * @param {expiredType} expired 可以指定相对时间，相对时间最小为0；可以设定绝对时间
   */
  public async put(key: string, value: any, expired?: expiredType): Promise<void> {
    // 触发删除过期数据
    this.dbInstance.deleteByTimestamp(Date.now())
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
      return
    }

    // 显式设置过期时间，则这次更新过期时间
    if (expired && expired > 0) {
      await this.dbInstance.put({
        id: key,
        value,
        timestamp: generateTimestamp(expired)
      })
      return
    }

    // 数据已过期，则重新写入时间
    if (result.timestamp <= Date.now()) {
      await this.dbInstance.put({
        id: key,
        value,
        timestamp: generateTimestamp(this.expired)
      })
      return
    }

    // 数据没过期，不需要更新时间
    await this.dbInstance.put({
      id: key,
      value,
      timestamp: result.timestamp
    })
  },

  /**
   * @description 初始化 indexedDB 连接
   */
  public init() {
    return this.dbInstance.init()
  }
}
