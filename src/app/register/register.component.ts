import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  clientform: FormGroup;
  platformForm: FormGroup;
  subscribeform: FormGroup;
  loadingClient = false;
  loadingPlatform = false;
  loadingSubscription = false;
    submitted = false;
    returnUrl: string;
    error: HttpErrorResponse;

    foo='Default value';

constructor(private fb: FormBuilder, private router: Router,  private route: ActivatedRoute,  private authService: AuthServiceService
  ){
  this.clientform = this.fb.group({
    client: ['', Validators.required]

  });

  this.platformForm = this.fb.group({
    platform: ['', Validators.required]
  });

  this.subscribeform = this.fb.group({
    subscribe: ['', Validators.required]
  });



}

     // convenience getter for easy access to form fields
     get f1() { return this.clientform.controls; }
     registerClient() {

      const val = this.clientform.value;

      this.submitted = true;
         // stop here if form is invalid
      if (this.clientform.invalid) {
           return;
       }
      this.loadingClient = true;
      if (val.client) {
           this.authService.registerClient(val.client)
             .pipe(first())
             .subscribe(
                 data => {
                 // this.parseClientJson(data);
                 // this.router.navigate([this.returnUrl]);
                 this.loadingClient = false;
                 },
                 error => {
                     this.error = error;
                     this.loadingClient = false;
                 });
         }



  }

  // convenience getter for easy access to form fields
       get f2() { return this.platformForm.controls; }
  // register platform
  registerToPlatform(){
    const val= this.platformForm.value;
    this.submitted = true;
         // stop here if form is invalid
    if (this.platformForm.invalid) {
           return;
       }
    this.loadingPlatform = true;
    if (val.platform) {
             this.authService.registerPlatform(val.platform)
             .pipe(first())
             .subscribe(
                 data => {
                  // this.parseClientJson(data);
                  // this.router.navigate([this.returnUrl]);
                  this.loadingPlatform = false;
                 },
                 error => {
                     this.error = error;
                     this.loadingPlatform = false;
                 });
         }

  }

     // convenience getter for easy access to form fields
     get f3() { return this.subscribeform.controls; }

    // subscribe to a device
    subscribeToDevice(){
      const val= this.subscribeform.value;
      this.submitted = true;
         // stop here if form is invalid
      if (this.subscribeform.invalid) {
           return;
       }
      this.loadingSubscription = true;
      if (val.subscribe) {
             this.authService.subscribeToDevice(val.subscribe)
             .pipe(first())
             .subscribe(
                 data => {
                console.log('response from client regitered'+JSON.stringify(data));
                this.authService.retrieveMsgs(localStorage.getItem('registered-client'));
                this.router.navigate([this.returnUrl]);
                this.loadingSubscription = false;
                 },
                 error => {
                     this.error = error;
                     this.loadingSubscription = false;
                 });
         }

    }


    parseClientJson(json: JSON){
      let client : any = JSON.parse(JSON.stringify(json));
      localStorage.setItem('clientId', client.clientId);

   }



  ngOnInit() {
    this.colapsable();
    this.returnUrl = this.route.snapshot.queryParams[this.returnUrl] || 'values';
  }

colapsable(){
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

}
