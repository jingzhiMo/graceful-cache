import { nullValue } from './null-value'

const DB_NAME = 'MSN_CACHE'
const DB_VERSION = 1
const STORE_NAME = 'MSN_TABLE'

export interface AddData {
  id: string
  timestamp: number
  value: any
}

export interface UpdateData {
  id: string
  value: any
  timestamp?: number
}

export class IndexedDB {
  db: IDBDatabase | null
  inited: boolean
  support: boolean

  constructor() {
    this.db = null
    this.inited = false
    this.support = false
  }

  init() {
    let self = this

    if (!window.indexedDB) {
      self.inited = true
      return Promise.resolve()
    }

    this.support = true
    return new Promise((resolve, reject) => {
      if (this.inited) {
        resolve(this.db)
        return
      }

      const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event: any) => {
        let db = event.target.result as IDBDatabase

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
        self.db = db
        self.inited = true
        resolve(db)
      }
      request.onsuccess = (event: any) => {
        self.db = event.target.result
        self.inited = true
        resolve(self.db)
      }
      request.onerror = event => {
        reject(event)
      }
    })
  }

  read(id: string): Promise<AddData | undefined> {
    if (!this.inited) throw new Error('need to execute "init" method')
    if (!this.support || !this.db) return Promise.resolve(undefined)

    const request = this.db.transaction([STORE_NAME])
      .objectStore(STORE_NAME)
      .get(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = function(event: any) {
        resolve(event.target.result)
      }
      request.onerror = event => {
        reject(event)
      }
    })
  }

  add(data: AddData) {
    if (!this.inited) throw new Error('need to execute "init" method')
    if (!this.support || !this.db) return

    const request = this.db.transaction([STORE_NAME], 'readwrite')
      .objectStore(STORE_NAME)
      .add(data)

    return new Promise((resolve, reject) => {
      request.onsuccess = resolve
      request.onerror = reject
    })
  }

  put(data: UpdateData) {
    if (!this.inited) throw new Error('need to execute "init" method')
    if (!this.support || !this.db) return

    const request = this.db.transaction([STORE_NAME], 'readwrite')
      .objectStore(STORE_NAME)
      .put(data)

    return new Promise((resolve, reject) => {
      request.onsuccess = resolve
      request.onerror = reject
    })
  }

  remove(id: string) {
    if (!this.inited) throw new Error('need to execute "init" method')
    if (!this.support || !this.db) return

    const request = this.db.transaction([STORE_NAME], 'readwrite')
      .objectStore(STORE_NAME)
      .delete(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = resolve
      request.onerror = reject
    })
  }

  deleteByTimestamp(maxTimestamp:  number) {
    if (!this.inited) throw new Error('need to execute "init" method')
    if (!this.support || !this.db) return


    const index = this.db.transaction([STORE_NAME], 'readwrite')
      .objectStore(STORE_NAME)
      .index('timestamp')
    const range = IDBKeyRange.upperBound(maxTimestamp, false)

    return new Promise((resolve, reject) => {
      const request = index.openCursor(range)

      request.onsuccess = (event: any) => {
        const cursor = event.target.result as IDBCursor

        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = reject
    })
  }
}
