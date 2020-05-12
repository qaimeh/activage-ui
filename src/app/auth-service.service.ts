import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string ) {
    return this.http.post<any>('/api/login', {username, password})
        // this is just the HTTP call,
        // we still need to handle the reception of the token
        //.shareReplay();
}

}
