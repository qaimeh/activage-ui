import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  form: FormGroup;
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
      this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });

    }

        // convenience getter for easy access to form fields
        get f() { return this.form.controls; }

  login() {
    const val = this.form.value;
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
  }

    this.loading = true;

    if (val.username && val.password) {
        this.authService.login(val.username, val.password)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {

                this.error = error;
                this.loading = false;
            });
    }
}


ngOnInit() {


  this.returnUrl = this.route.snapshot.queryParams[this.returnUrl] || 'clientlogin';
}

// When the user clicks the action button a.k.a. the logout button in the\
// modal, show an alert and followed by the closing of the modal


}
