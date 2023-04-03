import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
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
        `-output_0${second}.png`, 
      )
    })

    await this._ffmpeg.run(
      ...commands
    );
  }
}
