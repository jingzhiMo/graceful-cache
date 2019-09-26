import { MCache, clearStorage } from 'msn-cache'

var mc: MCache = new MCache({
    name: 'LRU',
    storage: 'localStorage',
    capacity: 2
})

interface IVal {
    value: string
}
var request = (): Promise<IVal> => {
    return new Promise((resolve, reject) => {
        console.log('need request')
        setTimeout(() => {
            resolve({
                value: 'second value'
            })
        }, 1500)
    })
}

mc.put('first', {
    value: 'first value'
})
mc.get('first', () => {
    console.log('use in first callback')
    return {
        first: 'first value'
    }
}).then(d => {
    console.log('first', d)
})

mc.get('second', () => {
    return request()
}).then(d => {
    console.log('second', d)
})
