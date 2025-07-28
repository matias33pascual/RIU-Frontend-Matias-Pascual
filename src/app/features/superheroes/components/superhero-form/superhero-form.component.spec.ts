import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UppercaseInputDirective } from '@shared/directives/uppercase-input.directive';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroFormComponent } from './superhero-form.component';

describe('SuperheroFormComponent', () => {
  let component: SuperheroFormComponent;
  let fixture: ComponentFixture<SuperheroFormComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<SuperheroFormComponent>>;

  const mockSuperhero: Superhero = {
    id: '1',
    name: 'Superman',
    realName: 'Clark Kent',
    superpower: 'Súper fuerza',
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        SuperheroFormComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        UppercaseInputDirective,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroFormComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<SuperheroFormComponent>
    >;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when no data provided', () => {
    expect(component.superheroForm.get('name')?.value).toBe('');
    expect(component.superheroForm.get('realName')?.value).toBe('');
    expect(component.superheroForm.get('superpower')?.value).toBe('');
  });

  it('should initialize form with provided data for editing', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [
        SuperheroFormComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        UppercaseInputDirective,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { superheroForUpdate: mockSuperhero },
        },
      ],
    });

    fixture = TestBed.createComponent(SuperheroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.superheroForm.get('name')?.value).toBe('Superman');
    expect(component.superheroForm.get('realName')?.value).toBe('Clark Kent');
    expect(component.superheroForm.get('superpower')?.value).toBe(
      'Súper fuerza'
    );
  });

  it('should have required validators', () => {
    const nameControl = component.superheroForm.get('name');
    const realNameControl = component.superheroForm.get('realName');
    const superpowerControl = component.superheroForm.get('superpower');

    nameControl?.setValue('');
    realNameControl?.setValue('');
    superpowerControl?.setValue('');

    expect(nameControl?.valid).toBeFalsy();
    expect(realNameControl?.valid).toBeFalsy();
    expect(superpowerControl?.valid).toBeFalsy();
  });

  it('should emit saveOrUpdateSuperhero when form is valid and submitted', () => {
    spyOn(component.saveOrUpdateSuperhero, 'emit');

    component.superheroForm.patchValue({
      name: 'Batman',
      realName: 'Bruce Wayne',
      superpower: 'Intelecto',
    });

    component.onSave();

    expect(component.saveOrUpdateSuperhero.emit).toHaveBeenCalledWith({
      name: 'Batman',
      realName: 'Bruce Wayne',
      superpower: 'Intelecto',
    });
  });

  it('should not emit saveOrUpdateSuperhero when form is invalid', () => {
    spyOn(component.saveOrUpdateSuperhero, 'emit');

    component.superheroForm.patchValue({
      name: '',
      realName: 'Bruce Wayne',
      superpower: 'Intelecto',
    });

    component.onSave();

    expect(component.saveOrUpdateSuperhero.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel when onCancel is called', () => {
    spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should display correct form labels', () => {
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('mat-label');

    expect(labels[0].textContent).toContain('Nombre');
    expect(labels[1].textContent).toContain('Nombre Real');
    expect(labels[2].textContent).toContain('Superpoder');
  });

  it('should show validation errors when fields are touched and invalid', () => {
    const nameControl = component.superheroForm.get('name');

    nameControl?.markAsTouched();
    nameControl?.setValue('');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('mat-error');
    expect(errorMessage?.textContent).toContain('obligatorio');
  });

  it('should validate minimum length for name', () => {
    const nameControl = component.superheroForm.get('name');
    nameControl?.setValue('a');
    nameControl?.markAsTouched();

    expect(nameControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate maximum length for name', () => {
    const nameControl = component.superheroForm.get('name');
    nameControl?.setValue('a'.repeat(51));
    nameControl?.markAsTouched();

    expect(nameControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('should validate minimum length for realName', () => {
    const realNameControl = component.superheroForm.get('realName');
    realNameControl?.setValue('a');
    realNameControl?.markAsTouched();

    expect(realNameControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate maximum length for realName', () => {
    const realNameControl = component.superheroForm.get('realName');
    realNameControl?.setValue('a'.repeat(51));
    realNameControl?.markAsTouched();

    expect(realNameControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('should validate minimum length for superpower', () => {
    const superpowerControl = component.superheroForm.get('superpower');
    superpowerControl?.setValue('a');
    superpowerControl?.markAsTouched();

    expect(superpowerControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate maximum length for superpower', () => {
    const superpowerControl = component.superheroForm.get('superpower');
    superpowerControl?.setValue('a'.repeat(201));
    superpowerControl?.markAsTouched();

    expect(superpowerControl?.errors?.['maxlength']).toBeTruthy();
  });
});
