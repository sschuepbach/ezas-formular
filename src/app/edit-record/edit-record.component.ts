import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EzasResult } from '../ezas-result';
import { DocumentRetrieverService } from '../document-retriever.service';
import { DocumentSenderService } from '../document-sender.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.css']
})
export class EditRecordComponent {

  ezasForm: FormGroup;
  saved = false;
  private index = 0;
  private id: string;
  @Output() currentId = new EventEmitter<string>();
  connectionError: boolean;

  constructor(private fb: FormBuilder, private dR: DocumentRetrieverService, private dS: DocumentSenderService) {
    dR.documents.subscribe(d => {
      if (d instanceof HttpErrorResponse) {
        this.connectionError = true;
      } else {
        this.connectionError = false;
        this.setValues(d[0]);
      }
    });
  }

  private setValues(document: EzasResult) {
    this.ezasForm = this.fb.group({});
    for (const fieldname of Object.keys(document)) {
      if (fieldname !== 'id') {
        this.ezasForm.addControl(fieldname, this.fb.array([]));
        for (const fieldvalue of document[fieldname]) {
          this.elementAsFormArray(fieldname).push(new FormControl(fieldvalue));
        }
      } else {
        this.id = document[fieldname];
        this.currentId.emit(this.id);
      }
    }
  }

  private elementAsFormArray(name: string): FormArray {
    return this.ezasForm.get(name) as FormArray;
  }

  getAllControls() {
    return Object.keys(this.ezasForm.getRawValue());
  }

  addField(formControlName: string) {
    this.elementAsFormArray(formControlName).push(new FormControl(''));
  }

  removeField(formControlName: string, index: number) {
    this.elementAsFormArray(formControlName).removeAt(index);
  }

  forward() {
    this.index += 1;
    this.dR.get(this.index);
    this.saved = false;
  }

  back() {
    if (this.index > 0) {
      this.index -= 1;
      this.dR.get(this.index);
      this.saved = false;
    }
  }

  save() {
    this.dS.save(this.id, this.ezasForm.getRawValue()).subscribe(() => this.saved = true);
  }

}
