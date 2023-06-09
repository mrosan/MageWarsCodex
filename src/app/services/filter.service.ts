import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { arenaSets } from 'src/app/data/sets';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterGroup = this.fb.group({
      name: [''],
      types: [[]],
      subTypes: [[]],
      schools: [[]],
      levels: [[]],
      novice: [false],
      only: [''],
      slots: [[]],
      strict: [false],
      sets: [arenaSets],
      epic: [false],
      commonSubtypes: [false],
    }); // TODO type
  }

  getFormGroup(): FormGroup {
    return this.filterGroup;
  }
}
