import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercaseInput]',
})
export class UppercaseInputDirective {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    this.transformToUppercase();
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    this.transformToUppercase();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    setTimeout(() => this.transformToUppercase(), 10);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'Tab') {
      this.transformToUppercase();
    }
  }

  private transformToUppercase(): void {
    const inputElement = this.el.nativeElement;
    const currentPosition = inputElement.selectionStart;
    const uppercasedValue = inputElement.value.toUpperCase();

    if (inputElement.value !== uppercasedValue) {
      inputElement.value = uppercasedValue;

      if (this.control?.control) {
        this.control.control.setValue(uppercasedValue, { emitEvent: false });
      }

      if (currentPosition !== null) {
        inputElement.setSelectionRange(currentPosition, currentPosition);
      }
    }
  }
}
