export type Trade = {
    name: string
    timestamp: number
    thoughts: Thought[]
}

export type Thought = {
    time: Date
    idea: string
}

export const trades: Trade[] = [{
    name: "",
    timestamp: 123,
    thoughts: []
}]