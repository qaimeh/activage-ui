import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent implements OnInit {
  registerBtn = false;
  clientform: FormGroup;
  loading = false;
    submitted = false;
    returnUrl: string;
    error: HttpErrorResponse;

    constructor(
      // public dialogRef: MatDialogRef<ModalComponent>,
       private fb: FormBuilder,
       private router: Router,
       private route: ActivatedRoute,
       private authService: AuthServiceService) {
         this.clientform = this.fb.group({
           username: ['', Validators.required],
         });
       }
       // convenience getter for easy access to form fields
       get f() { return this.clientform.controls; }

       getClient() {
         const val = this.clientform.value;
         this.submitted = true;
         // stop here if form is invalid
         if (this.clientform.invalid) {
           return;
       }
         this.loading = true;
         if (val.username) {
             this.authService.getClient(val.username)
             .pipe(first())
             .subscribe(
                 data => {
                  this.parseClientJson(data);
                  this.router.navigate([this.returnUrl]);
                 },
                 error => {
                     this.error = error;
                     this.loading = false;
                     this.registerBtn = true;
                 });
         }
     }
     ngOnInit() {
      this.registerBtn = false;
      this.returnUrl = this.route.snapshot.queryParams[this.returnUrl] || 'values';
     }

     parseClientJson(json: JSON){
        let client : any = JSON.parse(JSON.stringify(json));
        localStorage.setItem('clientId', client.clientId);

     }

}
