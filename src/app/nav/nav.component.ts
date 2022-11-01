import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public modal: ModalService) {}

  ngOnInit(): void {
  }

  openModal($event: Event) {
    //Users will not be redirected to a different page
    $event.preventDefault();

    return this.modal.toggleModal();
  }
}
