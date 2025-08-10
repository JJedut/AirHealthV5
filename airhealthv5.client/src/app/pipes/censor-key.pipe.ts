import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'censorKey'
})
export class CensorKeyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const censored = '*'.repeat(value.length - 4) + value.slice(-4);
    return censored;
  }
}

