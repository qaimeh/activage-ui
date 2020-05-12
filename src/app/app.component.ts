import { Component, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'activage';

  constructor(private elementRef: ElementRef, public matDialog: MatDialog){

  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#4e4e4e';
 }

 openModal() {
  const dialogConfig = new MatDialogConfig();
  // The user can't close the dialog by clicking outside its body
  dialogConfig.disableClose = true;
  dialogConfig.id = 'modal-component';
  dialogConfig.height = '350px';
  dialogConfig.width = '600px';
  // https://material.angular.io/components/dialog/overview
  const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
}


}
