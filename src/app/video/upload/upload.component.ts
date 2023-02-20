import { ClipService } from './../../services/clip.service';
import firebase  from 'firebase/compat/app';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragover: boolean = false;
  showAlert: boolean = false;
  inSubmission: boolean = false;
  showPercentage: boolean = false;
  file: File | null = null;
  hideForm = false;
  alertColor = 'blue';
  alertMessage = 'Uploading...';
  percentage: number = 0;
  user: firebase.User | null = null;

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


  constructor(
    private storageService: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService
    ) {
      auth.user.subscribe(user => {
        this.user = user;
      })
    }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer ? 
    ($event as DragEvent).dataTransfer?.files.item(0) as File ??  null:
    ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.hideForm = true;
  }

  uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const task = this.storageService.upload(clipPath, this.file)
    const clipReference = this.storageService.ref(clipPath);

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    })

    task.snapshotChanges().pipe(
      last(), 
      switchMap(() => clipReference.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: url
        }

        this.clipsService.createClip(clip);


        this.alertColor = 'green';
        this.alertMessage = 'Clip successfully updated!'
        this.showPercentage = false;
      },
      error: (error) => {
        this.uploadForm.enable();
        this.alertColor = 'red';
        this.alertMessage = 'Upload failed :(';
        this.inSubmission = true;
        this.showPercentage = false;
        console.log(error);
      }
    })
  }

}