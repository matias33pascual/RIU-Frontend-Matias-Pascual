import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  ],
  templateUrl: './superhero-form.component.html',
  styleUrl: './superhero-form.component.scss',
})
export class SuperheroFormComponent {
  superheroForUpdate = input<Superhero | null>(null);

  saveOrUpdateSuperhero = output<Superhero>();
  cancel = output<void>();

  superheroForm = new FormGroup({
    name: new FormControl(this.superheroForUpdate()?.name ?? '', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
  });

  private readonly _updateFormEffect = effect(() => {
    const superhero = this.superheroForUpdate();

    this.superheroForm.patchValue({
      name: superhero?.name ?? '',
    });
  });

  onSave() {
    if (this.superheroForm.invalid) {
      return;
    }

    const name = this.superheroForm.get('name')?.value?.trim() ?? '';

    const superhero: Superhero = this.superheroForUpdate()
      ? {
          ...this.superheroForUpdate(),
          name,
        }
      : {
          name,
        };

    this.superheroForm.reset();
    this.saveOrUpdateSuperhero.emit(superhero);
  }

  onCancel() {
    this.superheroForm.reset();
    this.cancel.emit();
  }
}
