import { Directive, HostListener, AfterViewChecked, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js/min';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective implements AfterViewChecked {

  constructor(public control: NgControl) {}

  ngAfterViewChecked(): void {
    this.onInputChange(this.control.value);
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: any): void {
    this.onInputChange(event);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: any): void {
    this.onInputChange(event.target.value);
  }

  onInputChange(phoneNumberString: string): void {
    try {
      const phoneNumber = parsePhoneNumber(phoneNumberString, 'US');
      const formattedNumber = phoneNumber.formatNational();
      this.control.valueAccessor?.writeValue(formattedNumber);
    } catch (error) {
      console.warn('Could not parse', phoneNumberString);
    }
  }
}
