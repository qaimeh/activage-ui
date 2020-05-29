
import { HttpClient, HttpHeaders, HttpRequest, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AppSettingsServiceService } from './../shared/app-settings-service.service';
import { Injectable } from '@angular/core';
import { AppSettings } from '../shared/AppSettings';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';


/**  rdf libraray link (https://www.npmjs.com/package/rdf/v/4.0.0) */

@Injectable({
  providedIn: 'root'
})
export class QuerymodelService {

  private sparkqlData = null;

  // class to set the app settings
  private configSetting: AppSettings;

  // constructor
  constructor( private http: HttpClient, private appSetttings: AppSettingsServiceService) {
    appSetttings.getSettings().subscribe(configSetting => this.configSetting = configSetting);
  }

createModel(parsed: any){

let metaData= parsed[0]['@graph'][0]['@graph'];

console.log('data model fubction: '+ metaData);

const rdf = require('rdf');
const createNamedNode = rdf.environment.createNamedNode.bind(rdf.environment);
const namednode = createNamedNode('http://example.com/');
console.log(namednode.toNT());

}

querySparqlEndpoint() {

const headers = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json, */*'
});

const params = new HttpParams()
.set('query',' SELECT ?results  FROM <http://activage.uix.dumy.data> WHERE {  <http://openiot.eu/resource/client/c10> <http://www.w3.org/ns/sosa/subscribedTo> ?o. ?o <http://www.w3.org/ns/sosa/hasSimpleResult> ?results. }   limit 10')
//.set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
.set ('format', 'json');

const opt= {
  params: params,
  headers : headers

}


this.http.get('http://activage.datascienceinstitute.ie:8890/sparql', opt).subscribe((data: Response) => {
console.log(data);
return data;
}), catchError((error: HttpErrorResponse) => {
  console.log('Handling error locally and rethrowing it...', error);
  console.log('error is:' + throwError(error));
  return throwError(error);
});

}


    /*return this.http.get<any>(`${this.configSetting.sparqlEndpoint}`, option).pipe(
      map((user: Response) => {
        console.log('reply from endpoint is: '+ user.json());
      return user;
    }), catchError((error: HttpErrorResponse) => {
      console.log('Handling error locally and rethrowing it...', error);
      console.log('error is:' + throwError(error));
      return throwError(error);
  })
  );*/


}
