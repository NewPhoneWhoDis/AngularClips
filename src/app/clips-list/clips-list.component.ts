import { Component, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css']
})
export class ClipsListComponent implements OnInit {

  constructor(public clipService: ClipService) {
    this.clipService.getClips()
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight} = document.documentElement;
    const { innerHeight } = window; 

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if(bottomOfWindow) {
      this.clipService.getClips()
      console.log("Handle scroll activated");
    }
  }

}