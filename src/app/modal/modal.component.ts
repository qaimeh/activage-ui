import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService) {
      this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }

  login() {
    const val = this.form.value;
    console.log('inside log function:');

    if (val.username && val.password) {
        this.authService.login(val.username, val.password)
            .subscribe(
                () => {
                    this.router.navigateByUrl('/');
                }
            );
    }
}


ngOnInit() {
}

// When the user clicks the action button a.k.a. the logout button in the\
// modal, show an alert and followed by the closing of the modal
actionFunction() {
  alert("You have logged out.");
  this.closeModal();
}

// If the user clicks the cancel button a.k.a. the go back button, then\
// just close the modal
closeModal() {
  this.dialogRef.close();
}

}
