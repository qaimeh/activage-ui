import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


import { AppSettings } from './AppSettings';
@Injectable({
  providedIn: 'root'
})
export class AppSettingsServiceService {
getSettings() : Observable <AppSettings> {
  let settings = new AppSettings();
  return of<AppSettings>(settings);
}
  constructor() { }
}
