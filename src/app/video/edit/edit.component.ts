import { ClipService } from './../../services/clip.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit, OnDestroy, Input, OnChanges, 
  SimpleChanges, Output, EventEmitter 
} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();
  showAlert: boolean = false;
  alertColor = 'blue';
  alertMessage = 'Updating clip...';

  clipID = new FormControl('', { nonNullable: true });
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(5)
    ],
    nonNullable: true
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(private modal: ModalService,
    private clipService: ClipService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip) return;
    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title as string);

    this.showAlert = false;
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregisterModal('editClip');
  }

  async submit() {
    if(!this.activeClip) return;

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Updating clip...';
    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMessage = 'Error updating clip';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.alertColor = 'green';
    this.alertMessage = 'Clip updated successfully';
  }

}
