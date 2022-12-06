import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }

  showAlert: boolean = false;
  alertMessage: string = '';
  alertColor: string = 'green';
  inSubmission: boolean = false;

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {
      
  }

  async login() {
    this.showAlert = true;
    this.alertMessage = 'Login in process!';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, 
        this.credentials.password
      )
    } catch (error) {
      this.inSubmission = false;
      this.alertMessage = 'An error occurred, please try again!';
      this.alertColor = 'red';
      return
    }

    this.alertMessage = 'Login successfull!';
    this.alertColor = 'green';
  }
}
