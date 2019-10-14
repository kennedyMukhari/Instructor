import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'instructor'
})
export class InstructorPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
