type algorithmName = 'FIFO' | 'LRU'
type storageName = 'sessionStorage' | 'localStorage'

interface IAlgorithm {
  name: algorithmName,
  capacity: number,
  storage: storageName
}

export default function initCache(algorithmOption: IAlgorithmOption) {
  // initCache({ name: 'LRU', capacity: 10, storage: 'sessionStorage' })
}
