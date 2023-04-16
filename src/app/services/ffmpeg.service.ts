import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning: boolean = false;
  isReady: boolean = false;
  private _ffmpeg;

  constructor() {
    this._ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if(this.isReady) return;

    await this._ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    let data = await fetchFile(file);

    this._ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1,2,3];
    const commands: string[] = [];

    seconds.forEach(second => {
      commands.push(
        '-i', file.name,
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',
        `output_0${second}.png`, 
      )
    })

    await this._ffmpeg.run(
      ...commands
    );

    const screenshots: string[] = [];
    seconds.forEach(second => {
      //const screenshotFile = this._ffmpeg.FS('readFile', `-output_0${second}.png`)
      const screenshotFile = this._ffmpeg.FS('readFile', `-output_0${second}.png`);
      const ssBLOB = new Blob(
        [screenshotFile.buffer], {
          type: 'image/png'
        }
      )

      const screenshotURL = URL.createObjectURL(ssBLOB);
      screenshots.push(screenshotURL);
    })

    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url: string) {
    const response  = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
