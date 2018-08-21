import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { EzasResult } from './ezas-result';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentRetrieverService {

  private size = 1;
  documents = new Subject<EzasResult[] | HttpErrorResponse >();
  private offset = 0;

  private static extractDocuments(res: any): EzasResult[] {
    const ezasRes: EzasResult[] = [];
    const getSource = (x: any) => x['_source'];
    for (const r of res.hits.hits) {
      const rSource = getSource(r);
      ezasRes.push({
        quelle: rSource['Quelle'],
        quellname: rSource['Quellname'],
        ausgabe: rSource['Ausgabe'],
        quellseite: rSource['Quellseite'],
        quelldatum: rSource['Quelldatum'],
        titel: rSource['Titel'],
        id: r['_id']
      });
    }
    return ezasRes;
  }

  constructor(private http: HttpClient) {
    this.retrieve(this.offset, this.size);
  }

  private retrieve(from: number, size: number): void {
    this.http
      .get(`${environment.api}_search?from=${from}&size=${size}`)
      .subscribe(res => this.documents.next(DocumentRetrieverService.extractDocuments(res)),
        err => this.documents.next(err) );
  }


  get(index: number) {
    this.retrieve(index, this.size);
  }

}
