import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperheroFormComponent } from './superhero-form.component';

describe('SuperheroFormComponent', () => {
  let component: SuperheroFormComponent;
  let fixture: ComponentFixture<SuperheroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit saveSuperhero when form is valid and onSave is called', () => {
    spyOn(component.saveOrUpdateSuperhero, 'emit');

    component.name.set('Superman');
    component.onSave();

    expect(component.saveOrUpdateSuperhero.emit).toHaveBeenCalledWith({
      name: 'Superman',
    });
  });

  it('should not emit saveSuperhero when form is invalid', () => {
    spyOn(component.saveOrUpdateSuperhero, 'emit');

    component.name.set('');
    component.onSave();

    expect(component.saveOrUpdateSuperhero.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel when onCancel is called', () => {
    spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should reset form when onCancel is called', () => {
    component.name.set('Test Name');

    component.onCancel();

    expect(component.name()).toBe('');
  });

  it('should validate form correctly', () => {
    component.name.set('');
    expect(component.isFormValid).toBe(false);

    component.name.set('Superman');
    expect(component.isFormValid).toBe(true);

    component.name.set('   ');
    expect(component.isFormValid).toBe(false);
  });
});
