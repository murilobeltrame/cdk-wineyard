export interface Wine {
    winery: string
    label: string
    country: string
    region: string
    grapes: string[]
    vintage: number,
    regulations?: string[]
}