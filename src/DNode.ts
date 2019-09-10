export interface IDNode {
    key: string
    value: any
    prev: null | IDNode
    next: null | IDNode
}

export class DNode implements IDNode {
    public key: string
    public value: any
    public next: null | IDNode
    public prev: null | IDNode

    constructor(key: string, value: any) {
        this.key = key
        this.value = value
        this.next = null
        this.prev = null
    }
}
