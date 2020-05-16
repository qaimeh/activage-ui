import { AppSettingsServiceService } from './app-settings-service.service';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';
import { AppSettings } from './AppSettings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private configSetting : AppSettings;

  constructor(private http: HttpClient, appsettingService: AppSettingsServiceService) {
    // load configurations
    appsettingService.getSettings().subscribe(configSetting => this.configSetting = configSetting);
   }


  getAll(){
    return this.http.get<User[]>(`${environment.apiUrl}/users`)
  }
}
