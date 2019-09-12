export declare type storageName = 'sessionStorage' | 'localStorage';
/**
 *  @desc storage 获取数据封装getItem
 *  @param  {String}  key  获取数据的key值
 *
 *  @return  null或JSON.parse后的数据
 */
export declare function getItem(storage: storageName, key: string): any;
/**
 *  @desc storage 写入数据封装 setItem
 *  @param  {String}  key  写入到storage的key值
 */
export declare function setItem(storage: storageName, key: string, value: any): void;
/**
 *  @desc  初始化 storage列表
 */
export declare function initStorageKey(storage: storageName): void;
