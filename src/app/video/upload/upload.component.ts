import { ClipService } from './../../services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import firebase  from 'firebase/compat/app';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';
import { combineLatest, forkJoin, switchMap } from 'rxjs';

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
  selectedScreenshot: string = "";
  screenshotTask?: AngularFireUploadTask;

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

    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.hideForm = true;
  }

  async uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot);
    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.task = this.storageService.upload(clipPath, this.file)
    const clipReference = this.storageService.ref(clipPath);

    this.screenshotTask = this.storageService.upload(screenshotPath, screenshotBlob);
    const screenshotReference = this.storageService.ref(screenshotPath);

    combineLatest([this.task.percentageChanges(),
    this.screenshotTask.percentageChanges()]).subscribe((progress) => {
      let [clipProgess, screenshotProgress] = progress;

      if(!clipProgess || !screenshotProgress) return;

      let total = clipProgess + screenshotProgress;

      this.percentage = total as number / 200;
    })

    forkJoin([this.task.snapshotChanges(),
    this.screenshotTask.snapshotChanges()]).pipe(
      switchMap(() => forkJoin([
        clipReference.getDownloadURL(),
        screenshotReference.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        let [clipUrl, screenshotUrl] = urls
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipUrl,
          screenshotUrl,
          screenshotFileName: `${clipFileName}.png`,
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

  isFfmpegRunning(): boolean {
    return this.ffmpegService.isRunning;
  }

}