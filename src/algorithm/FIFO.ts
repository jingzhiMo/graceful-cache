import { DNode, IDNode } from '../DNode'

interface IMap {
  [key: string]: DNode
}

export default class FIFO {
  private cache: IMap
  private head: DNode | null
  private tail: DNode | null
  private nowCapacity: number
  private capacity: number

  constructor(capacity: number) {
    this.capacity = capacity
    this.nowCapacity = 0
    this.cache = {}
    this.head = null
    this.tail = null
  }

  public get(key: string): any {
    if (!this.cache.hasOwnProperty(key)) {
      return -1
    }

    return this.cache[key].value
  }

  public put(key: string, value: any): void {
    // 已存在节点
    if (this.cache.hasOwnProperty(key)) {
      this.cache[key].value = value
      return
    }

    const node = new DNode(key, value)

    this.cache[key] = node
    if (this.tail === null) {
      this.tail = node
      this.head = node
      this.nowCapacity++
      return
    }

    // 设置当前进入的节点为头部节点
    node.next = this.head
    this.head!.prev = node
    this.head = node

    if (this.nowCapacity < this.capacity) {
      this.nowCapacity++
    } else {
      // 移除尾部节点
      delete(this.cache[this.tail.key])
      this.tail = this.tail.prev
      this.tail!.next = null
    }
  }
}
