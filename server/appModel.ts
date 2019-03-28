import mysql from "mysql";
import { IQuestionFetched } from './interfaces/IQuestionFetched';
import { IValidateResponse } from './interfaces/IValidateResponse';

export class AppModel {

    connection!: mysql.Connection;

    public connect(): void{
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        this.connection.connect((err: mysql.MysqlError) => {
            if (err){
                console.log(err);
            }
        });
    }

    public fetchQuestions(): Promise<IQuestionFetched[]>{
        return new Promise((resolve, reject) => {
            this.connect();
    
            const questionsToFetch: number = 7;
            const query: string = `SELECT subq.id AS questionId, a.id AS answerId, subq.question, answer 
                FROM (SELECT id, question 
                        FROM questions ORDER BY RAND() LIMIT ` + questionsToFetch + `) AS subq 
                INNER JOIN answers AS a ON a.questionId=subq.id`;
            
            this.connection.query(query, (err: mysql.MysqlError, rows: IQuestionFetched[]) => {
                if (err) {
                    throw err;
                }
    
                resolve(rows);
            });
        });
    }

    public validate(answerId: string): Promise<IValidateResponse> {
        return new Promise((resolve, reject) => {
            this.connect();

            const query: string = "SELECT isCorrect FROM answers WHERE id = " + answerId;

            this.connection.query(query, (err: mysql.MysqlError, rows: IValidateResponse[]) => {
                if (err) {
                    throw err;
                }

                if (+rows[0].isCorrect == 1) {
                    resolve({isCorrect: true});
                } else {
                    resolve({isCorrect: false});
                }
            })
        });
    }
}