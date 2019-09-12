import { DNode, IDNode } from '../DNode'
import { nullValue } from '../util/null-value'

interface IMap {
  [key: string]: IDNode
}

export default class LRUCache {
  public capacity: number
  private nowCapacity: number
  private cache: IMap
  private head: IDNode | null
  private tail: IDNode | null

  constructor(capacity: number) {
    this.capacity = capacity
    this.nowCapacity = 0
    this.cache = {}
    this.head = null
    this.tail = null
  }

  public get(key: string): any {
    if (!this.cache.hasOwnProperty(key)) {
      return nullValue
    }

    // 最近使用，把当前节点指为最前面
    const node = this.cache[key]

    // 当前节点就是头节点
    if (this.head === node) {
      return node.value
    }

    // 当前节点是尾节点
    if (this.tail === node) {
      this.tail = node.prev
      this.tail!.next = null
      this.head!.prev = node
      node.next = this.head
      this.head = node
      this.head.prev = null

      return node.value
    }

    // 当前节点在中间节点
    node.prev!.next = node.next
    node.next!.prev = node.prev
    node.next = this.head
    this.head!.prev = node
    this.head = node
    this.head.prev = null

    return node.value
  }

  public put(key: string, value: any): void {
    let node

    // 对已存在的节点进行修改
    if (this.cache.hasOwnProperty(key)) {
      node = this.cache[key]
      node.value = value

      // 当前节点就是头部节点
      if (this.head === node) {
        return
      }

      // 当前节点是尾部节点
      if (this.tail === node) {
        this.tail = this.tail.prev
        this.tail!.next = null
        node.next = this.head
        node.prev = null
        this.head!.prev = node
        this.head = node
        return
      }

      // 当前节点在中间节点
      node.prev!.next = node.next
      node.next!.prev = node.prev
      node.prev = null
      node.next = this.head
      this.head!.prev = node
      this.head = node
      return
    }

    node = new DNode(key, value)

    // 还没溢出容量
    if (this.nowCapacity < this.capacity) {
      // 已有第一个数据
      if (this.head) {
        node.next = this.head
        this.head.prev = node
        this.head = node
      } else {
        // 链表还没有初始化
        this.head = node
        this.tail = node
      }
      this.nowCapacity++
      this.cache[key] = node
      return
    }

    // 溢出指定缓存容量
    node.next = this.head
    this.head!.prev = node
    this.head = node

    // 当前缓存已存在该节点
    if (!this.cache.hasOwnProperty(key)) {
      delete(this.cache[this.tail!.key])
    }

    this.tail = this.tail!.prev
    this.cache[key] = node
  }
}
