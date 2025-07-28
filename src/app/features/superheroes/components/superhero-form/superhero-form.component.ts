import { CommonModule } from '@angular/common';
import { Component, Inject, Optional, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UppercaseInputDirective } from '@shared/directives/uppercase-input.directive';
import { Superhero } from '@superheroes/interfaces/superhero.interface';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-superhero-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    UppercaseInputDirective,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './superhero-form.component.html',
  styleUrl: './superhero-form.component.scss',
})
export class SuperheroFormComponent {
  cancel = output<void>();
  saveOrUpdateSuperhero = output<Superhero>();

  superheroForm: FormGroup;
  isEditing: boolean;
  formSubmitted: boolean = false;

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { superheroForUpdate: Superhero | null } | null
  ) {
    const superheroToEdit = this.data?.superheroForUpdate ?? null;
    this.isEditing = superheroToEdit !== null;

    this.superheroForm = new FormGroup({
      name: new FormControl(superheroToEdit?.name ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      realName: new FormControl(superheroToEdit?.realName ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      superpower: new FormControl(superheroToEdit?.superpower ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
    });
  }

  onSave() {
    this.formSubmitted = true;

    if (this.superheroForm.invalid) {
      return;
    }

    const superhero: Superhero = {
      ...this.data?.superheroForUpdate,
      ...this.superheroForm.value,
    };

    this.superheroForm.reset();
    this.formSubmitted = false;

    this.saveOrUpdateSuperhero.emit(superhero);
  }

  onCancel() {
    this.superheroForm.reset();
    this.formSubmitted = false;
    this.superheroForm.markAsUntouched();
    this.superheroForm.markAsPristine();

    Object.keys(this.superheroForm.controls).forEach((key) => {
      this.superheroForm.get(key)?.markAsUntouched();
      this.superheroForm.get(key)?.markAsPristine();
    });

    this.cancel.emit();
  }
}
