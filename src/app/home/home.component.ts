import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor() { }
  
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
      console.log("test bottom of window");
    }
  }

}
