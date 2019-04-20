export class Application {
    pages = {
        showGame: false,
        showWelcome: false,
        showResults: false,
        showWaitToJoin: false,
        showWaitToFinish: false,
        showCorrectAnswers: false
    }

    constructor() {
        this.getGamePage = this.getGamePage.bind(this);
        this.getWelcomePage = this.getWelcomePage.bind(this);
        this.getResultsPage = this.getResultsPage.bind(this);
        this.hideAllComponents = this.hideAllComponents.bind(this);
        this.getWaitToJoinPage = this.getWaitToJoinPage.bind(this);
        this.getWaitToFinishPage = this.getWaitToFinishPage.bind(this);
        this.getCorrectAnswersPage = this.getCorrectAnswersPage.bind(this);

        this.hideAllComponents();
    }

    getWelcomePage(): void {
        this.hideAllComponents();
        this.pages.showWelcome = true;
    }

    getWaitToJoinPage(): void {
        this.hideAllComponents();
        this.pages.showWaitToJoin = true;
    }

    getGamePage(): void {
        this.hideAllComponents();
        this.pages.showGame = true;
    }

    getWaitToFinishPage(): void {
        this.hideAllComponents();
        this.pages.showWaitToFinish = true;
    }

    getResultsPage(): void {
        this.hideAllComponents();
        this.pages.showResults = true;
    }

    getCorrectAnswersPage(): void {
        this.pages.showCorrectAnswers = !this.pages.showCorrectAnswers;
    }

    private hideAllComponents(): void {
        for(let prop in this.pages) {
            if (!this.pages.hasOwnProperty(prop)) {
                continue;
            }

            this.pages[prop] = false;
        }
    }

}