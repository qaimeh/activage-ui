import { QuerymodelService } from './semantic-web/querymodel.service';

import { AppSettingsServiceService } from './shared/app-settings-service.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AppSettings } from './shared/AppSettings';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { User } from './shared/User';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private currentUserSub: BehaviorSubject<User>;
  public curentUser: Observable<User>;

  private configSetting : AppSettings;

  constructor(private http: HttpClient, private appSetttings : AppSettingsServiceService, private queryModle: QuerymodelService) {
    this.currentUserSub = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.curentUser = this.currentUserSub.asObservable();
    // load configurations
    appSetttings.getSettings().subscribe(configSetting => this.configSetting = configSetting);
  }

  public get currentUserValue() : User {
    return this.currentUserSub.value;
  }

  login(username: string, password: string ) {

    //this.queryModle.querySparqlEndpoint();



    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    });
    const httpBody = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<User>(`${this.configSetting.aiotesUrl}${this.configSetting.auth}`, httpBody, {headers}).pipe(
      map(user => {

        let token : any = JSON.parse(JSON.stringify(user));
        token = token.access_token;
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('access_token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSub.next(user);
        return user;
    }), catchError((error: HttpErrorResponse) => {
      console.log('Handling error locally and rethrowing it...', error);
      console.log('error is:' + throwError(error));
      return throwError(error);
  })
  );
}


getDevicesInMsg(clientId: string) {

  const headers = new HttpHeaders({
  'accept': '*/*',
  'Client-ID': clientId,
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  return this.http.post<any>(`${this.configSetting.aiotesUrl}${this.configSetting.observations}`, {}, {headers}).pipe(
    map(obs => {
      return obs;
  }), catchError((error: HttpErrorResponse) => {
    console.log('Handling error locally and rethrowing it...', error);
    console.log('error is:' + throwError(error));
    return throwError(error);
})
);
}

retrieveMsgs(clientId: string) {

  const headers = new HttpHeaders({
  'accept': '*/*',
  'Client-ID': clientId,
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  return this.http.post<any>(`${this.configSetting.aiotesUrl}${this.configSetting.observations}`, {}, {headers}).pipe(
    map(obs => {
      return obs;
  }), catchError((error: HttpErrorResponse) => {
    console.log('Handling error locally and rethrowing it...', error);
    console.log('error is:' + throwError(error));
    return throwError(error);
})
);
}



/**
 *  check a client with ID is registered or not
 * @param clientId
 */
getClient(clientId: string){
  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'accept': 'application/json',
    'Client-ID': clientId,
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });


  return this.http.get<any>(`${this.configSetting.aiotesUrl}${this.configSetting.checkClient}${clientId}`, {headers}).pipe(
    map(user => {
    return user;
  }), catchError((error: HttpErrorResponse) => {
    console.log('Handling error locally and rethrowing it...', error);
    console.log('error is:' + throwError(error))
    return throwError(error);
})
);

}

/**
 *
 */
registerClient(clientData : string){

  const client  = JSON.parse(clientData);
  // set the client ID for other functions (e.g., registerplatform, etc.) to get this id
  localStorage.setItem('registered-client', client.clientId);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Client-ID': client.clientId,
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  let body: any = clientData;

  return this.http.post<any>(`${this.configSetting.aiotesUrl}${this.configSetting.client}`, body, {headers}).pipe(
    map(user => {

    let clientReg : any = JSON.stringify(user);
    return clientReg;
  }), catchError((error: HttpErrorResponse) => {
    console.log('Handling error locally and rethrowing it...', error);
    console.log('error is:' + throwError(error));
    // remove client from storage if it does already existed on server
    localStorage.removeItem('registered-client');

    return throwError(error);
})
);

}

registerPlatform(platformData: string){

  const platformBody  = JSON.parse(platformData);

  let body: any = platformBody;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Client-ID': localStorage.getItem('registered-client'),
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  return this.http.post<User>(`${this.configSetting.aiotesUrl}${this.configSetting.platformReg}`, body, {headers}).pipe(
    map(user => {
      this.currentUserSub.next(user);
      return user;
  }), catchError((error: HttpErrorResponse) => {
    console.log('Handling error locally and rethrowing it...', error);
    console.log('error is:' + throwError(error));
    return throwError(error);
})
);

}

subscribeToDevice (subcriptionData: string){

  const subscriptionBody  = JSON.parse(subcriptionData);

  let body: any = subscriptionBody;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Client-ID': localStorage.getItem('registered-client'),
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  return this.http.post<User>(`${this.configSetting.aiotesUrl}${this.configSetting.subscribeToDevice}`, body, {headers}).pipe(
    map(user => {
      let subscriptionResp : any = JSON.stringify(user);
      console.log('subscription resposne is: ' + subscriptionResp);
      return user;

  }), catchError((error: HttpErrorResponse) => {
    console.log('Handling error locally and rethrowing it...', error);
    console.log('error is:' + throwError(error));
    return throwError(error);
})
);


}

logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  this.currentUserSub.next(null);
}

}
