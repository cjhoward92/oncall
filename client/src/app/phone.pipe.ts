import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js/min';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneNumberString: string): string {
    try {
      const phoneNumber = parsePhoneNumber(phoneNumberString, 'US');
      return phoneNumber.formatNational();
    } catch (error) {
      console.warn('Could not parse', phoneNumberString);
      return phoneNumberString;
    }
  }
}
