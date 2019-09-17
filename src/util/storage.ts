import { nullValue } from '../util/null-value'

export type storageName = 'sessionStorage' | 'localStorage'

const prefix: string = 'GC_'
const storageKeyListName: string = 'GC_KEY_LIST'
let storageKey: Set<string>

/**
 *  @desc storage 获取数据封装getItem
 *  @param  {storageName} storage  选用sessionStorage或者localStorage
 *  @param  {String}  key  获取数据的key值
 *
 *  @return  null或JSON.parse后的数据
 */
export function getItem(storage: storageName, key: string): any {
  const value: string | null = window[storage].getItem(prefix + key)

  if (value === null) {
    return nullValue
  } else {
    return JSON.parse(value)
  }
}

/**
 *  @desc storage 写入数据封装 setItem
 *  @param  {storageName} storage  选用sessionStorage或者localStorage
 *  @param  {String}  key  写入到storage的key值
 *  @param  {any}  value  storage的值
 */
export function setItem(storage: storageName, key: string, value: any): void {
  const newKey: string = prefix + key
  const keySize: number = storageKey.size

  storageKey.add(newKey)

  // key 值不存在，更新key值
  if (storageKey.size > keySize) {
    window[storage].setItem(storageKeyListName, JSON.stringify(Array.from(storageKey)))
  }

  window[storage].setItem(newKey, JSON.stringify(value))
}

/**
 *  @desc  根据当前storageKey，删除 storage 的数据
 *  @param  {storageName} storage  选用sessionStorage或者localStorage
 */
export function clearItem(storage: storageName): void {
  let key: string

  initStorageKey(storage)

  for (key of storageKey) {
    window[storage].removeItem(key)
  }

  window[storage].removeItem(storageKeyListName)
}

/**
 *  @desc  初始化 storage列表
 */
export function initStorageKey(storage: storageName): void {
  const keyList: string | null = window[storage].getItem(storageKeyListName)

  if (!keyList) {
    storageKey = new Set([])
  } else {
    storageKey = new Set(JSON.parse(keyList))
  }
}
