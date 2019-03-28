export interface IQuestionArranged {
    id: number
    question: string
    answers: IAnswer[]
}

interface IAnswer{
    id: number,
    answer: string
}
