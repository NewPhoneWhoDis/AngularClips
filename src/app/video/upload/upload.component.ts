import { ClipService } from './../../services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import firebase  from 'firebase/compat/app';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
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
  task?: AngularFireUploadTask;
  screenshots: string[] = [];

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
    private clipsService: ClipService,
    private router: Router,
    private ffmpegService: FfmpegService
    ) {
      auth.user.subscribe(user => {
        this.user = user;
      })

      this.ffmpegService.init();
    }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event: Event) {
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer ? 
    ($event as DragEvent).dataTransfer?.files.item(0) as File ??  null:
    ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

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

    this.task = this.storageService.upload(clipPath, this.file)
    const clipReference = this.storageService.ref(clipPath);

    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = progress as number / 100;
    })

    this.task.snapshotChanges().pipe(
      last(), 
      switchMap(() => clipReference.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocumentReferance = await this.clipsService.createClip(clip);


        this.alertColor = 'green';
        this.alertMessage = 'Clip successfully updated!'
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocumentReferance.id
          ])
        }, 1500)
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

  isFfmpegReady(): boolean {
    return this.ffmpegService.isReady;
  }

}