import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {EzasResult} from './ezas-result';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentSenderService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private static createPartialUpdateBody(doc: EzasResult): any {
    delete doc.id;
    for (const key of Object.keys(doc)) {
      doc[this.capitalizeFirstLetter(key)] = doc[key];
      delete doc[key];
    }
    return {'doc': doc};
  }

  private static capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  constructor(private http: HttpClient) {
  }


  save(id: string, doc: any) {
    return this.http.post(
      `${environment.api}document/${id}/_update`,
      DocumentSenderService.createPartialUpdateBody(doc),
      this.httpOptions
    )
      .pipe(
        catchError(x => {
          console.log(x);
          return x;
        })
      );
  }
}
