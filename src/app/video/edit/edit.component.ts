import { ModalService } from './../../services/modal.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import IClip from 'src/app/models/clip.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() activeClip: IClip | null = null;

  constructor(private modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregisterModal('editClip');
  }

}
