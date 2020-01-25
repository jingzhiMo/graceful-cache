var req = indexedDB.open('idb', 1)
var db
var personStore

req.onerror = event => {
  console.log('open db error', event)
}

req.onupgradeneeded = event => {
  console.log('upgraded')
  db = event.target.result
  if (!db.objectStoreNames.contains('person')) {
    personStore = db.createObjectStore('person', {
      keyPath: 'id'
    })
  }
}

req.onsuccess = event => {
  db = event.target.result
  console.log('open db success', db)
}

function add(data) {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add(data)

  request.onsuccess = event => {
    console.log('写入数据成功', data)
  }

  request.onerror = event => {
    console.log('写入数据出错', data)
  }
}

function read(query) {
  var transaction = db.transaction(['person'])
  var store = transaction.objectStore('person')
  var request = store.get(query)

  request.onsuccess = event => {
    console.log('读取数据完成', event.target.result)
  }

  request.onerror = event => {
    console.log('读取数据出错', event)
  }
}

function put(query) {
  var store = db.transaction(['person'], 'readwrite').objectStore('person')
  var request = store.put(query)

  request.onsuccess = () => {
    console.log('更新成功 success')
  }

  request.onerror = event => {
    console.log('更新失败 error', event)
  }
}

function remove(query) {
  var store = db.transaction(['person'], 'readwrite').objectStore('person')
  var request = store.delete(query)

  request.onsuccess = event => {
    console.log('删除成功 success', event.target.result)
  }

  request.onerror = event => {
    console.log('删除失败 error', event)
  }
}
