import { QuerymodelService } from './semantic-web/querymodel.service';
import { UserService } from './shared/user.service';
import { AppSettingsServiceService } from './shared/app-settings-service.service';
import { AuthServiceService } from './auth-service.service';
import { ModalComponent } from './modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ValuesComponent } from './values/values.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientLoginComponent } from './client-login/client-login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    ModalComponent,
    ValuesComponent,
    ClientLoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [AuthServiceService, AppSettingsServiceService, UserService, QuerymodelService],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
