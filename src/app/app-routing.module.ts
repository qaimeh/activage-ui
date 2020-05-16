import { RegisterComponent } from './register/register.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { ValuesComponent } from './values/values.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';


const routes: Routes = [

  { path: 'login', component: ModalComponent },
  { path: 'values', component: ValuesComponent},
  { path: 'clientlogin', component: ClientLoginComponent},
  { path: 'register', component: RegisterComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
