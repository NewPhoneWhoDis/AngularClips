import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() { }

  register(id: string) {
    this.modals.push({ id, visible: false });
  }

  isModalVisible(id: string): boolean {
    /* with !! true value remains true false value remains false basically converts
    converts non-boolean into boolean value */
    return !!this.modals.find(element => element.id === id)?.visible;
  }

  toggleModal(id: string) {
    const modal = this.modals.find(element => element.id === id);

    if (modal) {
      modal.visible = !modal.visible;
    }
  }

  unregisterModal(id: string) {
    this.modals = this.modals.filter(element => element.id !== id);
  }
}
