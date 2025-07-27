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
  ],
  templateUrl: './superhero-form.component.html',
  styleUrl: './superhero-form.component.scss',
})
export class SuperheroFormComponent {
  cancel = output<void>();
  saveOrUpdateSuperhero = output<Superhero>();

  superheroForm: FormGroup;

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { superheroForUpdate: Superhero | null } | null
  ) {
    const superheroToEdit = this.data?.superheroForUpdate ?? null;

    this.superheroForm = new FormGroup({
      name: new FormControl(superheroToEdit?.name ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
    });
  }

  onSave() {
    if (this.superheroForm.invalid) {
      return;
    }

    const name = this.superheroForm.get('name')?.value?.trim() ?? '';

    const superhero: Superhero = { ...this.data?.superheroForUpdate, name };

    this.superheroForm.reset();

    this.saveOrUpdateSuperhero.emit(superhero);
  }

  onCancel() {
    this.superheroForm.reset();

    this.cancel.emit();
  }
}
