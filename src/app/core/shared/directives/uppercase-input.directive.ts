import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]',
})
export class UppercaseInputDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    const uppercased = inputElement.value.toUpperCase();

    inputElement.value = uppercased;
  }
}
