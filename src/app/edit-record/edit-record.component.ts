import {Component, EventEmitter, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {EzasResult} from '../ezas-result';
import {DocumentRetrieverService} from '../document-retriever.service';
import {DocumentSenderService} from '../document-sender.service';

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

  constructor(private fb: FormBuilder, private dR: DocumentRetrieverService, private dS: DocumentSenderService) {
    this.createForm();
    dR.documents.subscribe(d => this.setValues(d[0]));
  }

  private createForm() {
    this.ezasForm = this.fb.group({
      quelle: this.fb.array([]),
      quellname: this.fb.array([]),
      ausgabe: this.fb.array([]),
      quellseite: this.fb.array([]),
      quelldatum: this.fb.array([]),
      titel: this.fb.array([])
    });
  }


  private setValues(document: EzasResult) {
    for (const fieldname of Object.keys(document)) {
      if (fieldname !== 'id') {
        for (const fieldvalue of document[fieldname]) {
          if (this.elementAsFormArray(fieldname).length > 0) {
            this.elementAsFormArray(fieldname).removeAt(0);
          }
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
