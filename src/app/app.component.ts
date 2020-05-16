import { AuthServiceService } from './auth-service.service';

import { Component, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { User } from './shared/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'activage';
  currentUser: User;

  constructor(
    private elementRef: ElementRef,
    public matDialog: MatDialog,
    private authticationService: AuthServiceService,
    private router: Router){

      authticationService.curentUser.subscribe(x => this.currentUser = x);
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#d8d2d2';
 }


logout(){
  this.authticationService.logout();
  this.router.navigate(['/login']);
}


}
