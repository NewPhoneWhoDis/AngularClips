import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visible = false;

  constructor() { }

  isModalVisible(): boolean {
    return this.visible;
  }

  toggleModal() {
    this.visible = !this.visible;
    /*
    if(this.isModalVisible()) {
      return !this.visible;
    }
    return !this.visible;
    */
  }
}
