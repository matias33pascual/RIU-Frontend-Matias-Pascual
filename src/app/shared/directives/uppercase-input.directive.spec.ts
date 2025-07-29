import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseInputDirective } from './uppercase-input.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UppercaseInputDirective],
  template: `
    <form [formGroup]="testForm">
      <input formControlName="testInput" appUppercaseInput />
    </form>
  `,
})
class TestComponent {
  testForm = new FormGroup({
    testInput: new FormControl(''),
  });
}

describe('UppercaseInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should create', () => {
    const directive = inputEl.injector.get(UppercaseInputDirective);
    expect(directive).toBeTruthy();
  });

  it('should convert input to uppercase on input event', () => {
    const input = inputEl.nativeElement;

    input.value = 'batman';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('BATMAN');
    expect(component.testForm.get('testInput')?.value).toBe('BATMAN');
  });

  it('should handle empty input', () => {
    const input = inputEl.nativeElement;

    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('');
    expect(component.testForm.get('testInput')?.value).toBe('');
  });

  it('should handle whitespace only input', () => {
    const input = inputEl.nativeElement;

    input.value = '   ';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('   ');
    expect(component.testForm.get('testInput')?.value).toBe('   ');
  });

  it('should handle mixed case input', () => {
    const input = inputEl.nativeElement;

    input.value = 'WoNdEr WoMaN';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('WONDER WOMAN');
    expect(component.testForm.get('testInput')?.value).toBe('WONDER WOMAN');
  });

  it('should handle Enter key press', () => {
    const input = inputEl.nativeElement;

    input.value = 'test value';
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(enterEvent);

    expect(input.value).toBe('TEST VALUE');
  });

  it('should handle Tab key press', () => {
    const input = inputEl.nativeElement;

    input.value = 'tab test';
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    input.dispatchEvent(tabEvent);

    expect(input.value).toBe('TAB TEST');
  });

  it('should not transform on other key presses', () => {
    const input = inputEl.nativeElement;

    input.value = 'lowercase';
    const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    input.dispatchEvent(arrowEvent);

    expect(input.value).toBe('lowercase');
  });

  it('should handle case where value is already uppercase', () => {
    const input = inputEl.nativeElement;

    input.value = 'ALREADY UPPER';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('ALREADY UPPER');
    expect(component.testForm.get('testInput')?.value).toBe('ALREADY UPPER');
  });
});
