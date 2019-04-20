export class Player {
    score: number = 0;
    answeredQuestions: number = 0;
    isConnected: boolean = true;
    timeOver: boolean = false;
    private markedAnswers: number[] = [];

    constructor(
        public id: string,
        public username: string
    ) {
        console.log(`[new-player] A new Player with ID: ${this.id} has been generated.`);

        this.addMarkedAnswer = this.addMarkedAnswer.bind(this);
        this.getMarkedAnswers = this.getMarkedAnswers.bind(this);
    }

    addMarkedAnswer(answerId: number): void {
        this.markedAnswers.push(answerId);
    }

    getMarkedAnswers(): number[] {
        return this.markedAnswers;
    }
}