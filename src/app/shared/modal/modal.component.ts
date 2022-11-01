import { ModalService } from './../../services/modal.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() modalID = '';

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.toggleModal(this.modalID);
  }

}
