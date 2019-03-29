export interface IQuestion{
    id: number
    question: string
    answers: IAnswer[]
}

interface IAnswer{
    id: number,
    answer: string
}