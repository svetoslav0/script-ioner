import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { 
    HttpClient, HttpHeaders, HttpErrorResponse 
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable({
    providedIn: "root"
})
export class ApiService {

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(error);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public startNewGame (): Observable<any> {
    let url: string = 'http://localhost:5001/start-new-game/';

    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  public reqQuestion (): Observable<any> {
    let url: string = 'http://localhost:5001/question-api/';

    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  public validateAnswer (answer: string): Observable<any> {
    let url: string = 'http://localhost:5001/validate-answer/' + answer;

    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
}