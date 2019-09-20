# msn-cache
`msn` 是什么？

`msn`分别是`memory`, `storage`, `network`的首字母。

这是一个用于处理缓存的工具，针对`memory` => `storage` => `network` 逐级递减来获取缓存，优先从`memory`提取数据，若不存在则通过`storage`获取，若还是存在，则发出请求获取数据；其中对`memory`的处理算法规则，使用`LRU`、`FIFO`算法来处理（后续会添加`LFU`算法），避免过度占用内存。


Table of Contents
=================

* [msn-cache](#msn-cache)
  * [Background](#background)
  * [Install](#install)
  * [Usage](#usage)
  * [API](#api)
     * [Global method](#global-method)
        * [MCache](#mcache)
        * [clearStorage](#clearstorage)
     * [Instance Method](#instance-method)
        * [get](#get)
        * [put](#put)
  * [License](#license)

## Background

在应用运行的时候，可能会存在部分数据在切换路由的时候重复请求；如果把所有请求数据都缓存下来，使用时间越久，内存缓存的数据就一直递增。这一个工具利用比较常见的算法处理内存中的缓存，把溢出当前处理的数据，写入到`storage`(`localStorage`或`sessionStorage`)中，能够减少一定内存使用。

## Install

```
yarn add msn-cache
# or
npm install msn-cache
```

## Usage

```js
import MCache from 'msn-cache'

const mc = new MCache({
  name: 'LRU',
  capacity: 2,
  storage: 'sessionStorage'
})

// get value from cache
mc.get('key', () => { /* request function */ })
// put new key-value in cache
mc.put('key', value)
```

* [*LRU算法*](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))
* [*LFU算法*](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least-frequently_used_(LFU))
* [*FIFO算法*](https://en.wikipedia.org/wiki/Cache_replacement_policies#First_in_first_out_(FIFO))

## API

### Global method
#### MCache

* 描述
  cache的class，用于生成缓存实例
* 参数
  * `{String} name` 缓存的算法类型，目前可以指定"LRU"、"FIFO"两种算法
  * `{String} storage` 选用storage类型，可以指定"localStorage"、"sessionStorage"两种类型
  * `{Number} capacity` 设置内存缓存的数量
* 返回值：缓存实例
* 用法

```js
import { MCache } from 'msn-cache'
const mc = new MCache({
  name: 'LRU',
  capacity: 2,
  storage: 'sessionStorage'
})
```

#### clearStorage

* 描述
  清除选中的storage的存储数据
* 参数
  * `{String} storage` 清除的storage类型
* 返回值：void
* 用法

```js
import { clearStorage } from 'msn-cache'

// clear existed storage data
clearStorage('sessionStorage')

const mc = new MCache(/* ... */)
```

### Instance Method
#### get

* 描述
   获取缓存中的数据
* 参数
  * `{String} key` 设置到cache的key值
  * `{Function} fn` 当从内存与storage获取不到数据，则调用该方法返回数据，支持Promise使用
* 返回值：Promise，resolve数据为获取到的数据
* 用法

```js
const mc = new MCache({/* ... */})

(async function wrap() {
  let value = await mc.get('key', () => {
    // 获取不到数据的回调方法
    return fetch('/api/example')
  })
})()
```

#### put

* 描述
  往缓存中写入数据
* 参数
  * `{String} key` 设置到cache的key值
  * `{Any} value` 设置到cache的value值，undefined除外
* 返回值：void
* 用法

```js
const mc = new MCache({/* ... */})

mc.put('key', { value: 'this is cache value' })
```

## License
MIT
