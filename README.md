# graceful-cache

这是一个用于处理缓存的工具，针对`memory` => `storage` => `network` 逐级递减来获取缓存；其中对`memory`的处理规则，使用`LRU`、`LFU`、`FIFO`算法来处理，避免过度占用内存。
