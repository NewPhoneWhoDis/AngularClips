import { Pipe, PipeTransform } from '@angular/core';
import firebase  from 'firebase/compat/app';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: firebase.firestore.FieldValue) {
    if (value instanceof firebase.firestore.Timestamp) {
      let date = value.toDate();
      return this.datePipe.transform(date, 'mediumDate');
    }
    
    return;
  }

}
