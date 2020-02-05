import { MCache } from 'msn-cache'

var mc: MCache = new MCache(
    {
        name: 'LRU',
        capacity: 3
    }
)

async function start() {
    console.log('start')
    await mc.init()
}

var run = document.getElementById('run') as HTMLBaseElement
var first = document.getElementById('first') as HTMLBaseElement
var second = document.getElementById('second') as HTMLBaseElement
var third = document.getElementById('third') as HTMLBaseElement
var forth = document.getElementById('forth') as HTMLBaseElement

first.addEventListener('click', async () => {
    console.log('first', await mc.get('first', () => {
        console.log('first: from network')
        return 'first-value'
    }, 1))
})

second.addEventListener('click', async () => {
    // await mc.put('second', 'second-value')
    console.log('second', await mc.get('second', () => {
        console.log('second: from network')
        return 'second-value'
    }))
})

third.addEventListener('click', async () => {
    // await mc.put('third', 'third-value')
    console.log('third', await mc.get('third', () => {
        console.log('third: from network')
        return 'third-value'
    }))
})

forth.addEventListener('click', async () => {
    console.log('forth', await mc.get('forth'))
})
run.addEventListener('click', start)
