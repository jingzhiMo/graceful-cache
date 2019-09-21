export declare type storageName = 'sessionStorage' | 'localStorage';
/**
 *  @desc storage 获取数据封装getItem
 *  @param  {storageName} storage  选用sessionStorage或者localStorage
 *  @param  {String}  key  获取数据的key值
 *
 *  @return  null或JSON.parse后的数据
 */
export declare function getItem(storage: storageName, key: string): any;
/**
 *  @desc storage 写入数据封装 setItem
 *  @param  {storageName} storage  选用sessionStorage或者localStorage
 *  @param  {String}  key  写入到storage的key值
 *  @param  {any}  value  storage的值
 */
export declare function setItem(storage: storageName, key: string, value: any): void;
/**
 *  @desc  根据当前storageKey，删除 storage 的数据
 *  @param  {storageName} storage  选用sessionStorage或者localStorage
 *  @param  {Array<string>} keyList 删除指定的key值数据
 */
export declare function clearItem(storage: storageName, keyList?: Array<string>): void;
/**
 *  @desc  初始化 storage列表
 */
export declare function initStorageKey(storage: storageName): void;
