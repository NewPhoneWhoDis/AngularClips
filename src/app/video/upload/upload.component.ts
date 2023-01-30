import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragover: boolean = false;
  file: File | null = null;
  hideForm = false;

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(5)
    ],
    nonNullable: true
  });

  uploadForm = new FormGroup({
    title: this.title
  })


  constructor(private storageService: AngularFireStorage) { }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) as File;

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.hideForm = true;
  }

  uploadFile() {
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this.storageService.upload(clipPath, this.file)
  }

}
