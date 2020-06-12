import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { QuerymodelService } from './../semantic-web/querymodel.service';
import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { first, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { isDefined } from '@angular/compiler/src/util';
import { throwError } from 'rxjs';
import { Chart } from 'chart.js';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit {

  title = 'values';
  private timer: any;
  sub: any;
  showDiv=false;
  sensorId: any;
  geosparql: any;
  result: any;
  unit: any;
  observationTime: any;
  chart: Chart;
  private myData: MyData [] = [];
  devicesArray = [];
  deviceArrayFromSparql = [];
  deviceURI: string;
  wellBeingReport: WellbeingReport [] = [];
  wellComeClientMsg: any;


  constructor(private http: HttpClient,
    private authService: AuthServiceService,
    private route: ActivatedRoute,
    private qryModel: QuerymodelService) { this.wellComeClientMsg = localStorage.getItem('clientId')}

  ngOnInit(): void {

      if(this.timer!=null)
        clearInterval(this.timer);

    this.timer = setInterval(_ => {
      //this.getObservations(0);
  }, 10000);
  }

   ngAfterViewInit(): void {

    // this will get the device from the observation msg
    this.numberOfDevices();

    // this will get the devices for this client from the SPARQL endpoint
    this.queryClient4DeviceSubs();
  }

  getReport(e){

    let num =e.target.value

    this.getAVG_MIN_MAX(num);
    // to popup the graph (at the moment is dummy data will have to populate with real data)
    this.querySparqlEndpoint(num);

  }

  wellBeing(deviceNumber: any){

    // set the deviceURI value which is used in radio button function

    this.deviceURI= deviceNumber.target.value;
    this.showDiv=true;
    console.log('clicked');

  }

  /**
   * this function query the avarage max and min values from sparql endpoint
   */

   getAVG_MIN_MAX(num: any){

let queryStr = `SELECT (AVG(?results) AS ?avg)
(MIN(?results) AS ?min)
(MAX(?results) AS ?max)
WHERE {

select * {
<http://openiot.eu/resource/${localStorage.getItem('clientId')}>   a       <http://openiot.eu/resource/Client>;
<http://openiot.eu/resource/deviceSubscription> ?deviceSub.

?deviceSub <http://openiot.eu/ontology/category> ?category.

?observation  <http://www.w3.org/ns/sosa/madeBySensor> ?deviceSub.

?observation  <http://inter-iot.eu/message/dateTimeStamp> ?timeStamp.

?observation  <http://www.w3.org/ns/sosa/hasSimpleResult> ?results.

BIND (bif:datediff('day', xsd:DateTime(?timeStamp),now() ) AS ?duration)

FILTER ( ?duration >= ${num} )

Filter (?deviceSub = <${this.deviceURI}>)
}

GROUP BY ?results
}`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, */*'
      });

      const params = new HttpParams()
      .set('query',queryStr)
      // .set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
      .set ('format', 'json');

      const opt= {
        params : params,
        headers : headers

      }

      this.http.get('http://localhost:8890/sparql', opt).subscribe((data: Response) => {
      console.log(data);
      let prsRslt= JSON.parse(JSON.stringify(data));
      let results= prsRslt.results.bindings;

      //clear the old data in array if existed
      this.wellBeingReport.length=0;

      for(let result in results ){
        let values= results[result];

          for(let val in values){
          // first parameter of wellbeingReport is:
          //  a key (ie., avg, max, min)
          // and second param is a property (ie., avg, max, min values )
          this.wellBeingReport.push(new WellbeingReport(val,values[val].value))


          }
      }

      }), catchError((error: HttpErrorResponse) => {
        console.log('Handling error locally and rethrowing it...', error);
        console.log('error is:' + throwError(error));
        return throwError(error);
      });

   }
 /*
 * this function query the number of devices this client is subscribed for
 */
  queryClient4DeviceSubs (){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, */*'
    });

    const params = new HttpParams()
    .set('query','SELECT ?deviceSub  {<http://openiot.eu/resource/'+localStorage.getItem('clientId')+'>   a       <http://openiot.eu/resource/Client>; <http://openiot.eu/resource/deviceSubscription> ?deviceSub. }')
    // .set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
    .set ('format', 'json');

    const opt= {
      params : params,
      headers : headers

    }

    this.http.get('http://localhost:8890/sparql', opt).subscribe((data: Response) => {
    console.log(data);
    let prsRslt= JSON.parse(JSON.stringify(data));
    let results= prsRslt.results.bindings;
    let i = 0;
    this.deviceArrayFromSparql.length=0;// = [];
    for(let result in results ){
      let values= results[result];
        for(let val in values){
            i=i+=1;
        console.log(values[val].value);
              this.deviceArrayFromSparql.push(values[val].value);


        }
    }

    }), catchError((error: HttpErrorResponse) => {
      console.log('Handling error locally and rethrowing it...', error);
      console.log('error is:' + throwError(error));
      return throwError(error);
    });
  }

  querySparqlEndpoint(num: number) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, */*'
    });

    const params = new HttpParams()
    .set('query',' SELECT ?results  FROM <http://activage.uix.dumy.data> WHERE {  <http://openiot.eu/resource/client/c10> <http://www.w3.org/ns/sosa/subscribedTo> ?o. ?o <http://www.w3.org/ns/sosa/hasSimpleResult> ?results. }   limit '+num)
    // .set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
    .set ('format', 'json');

    const opt= {
      params : params,
      headers : headers

    }


    this.http.get('http://activage.datascienceinstitute.ie:8890/sparql', opt).subscribe((data: Response) => {
    console.log(data);
    let prsRslt= JSON.parse(JSON.stringify(data));
    let results= prsRslt.results.bindings;
    let i = 0;

    for(let result in results ){
      let values= results[result];
        for(let val in values){
            i=i+=1;
              const data =new MyData(i,values[val].value);
              this.myData.push(data);


        }
    }


     // console.log('jsojn string '+JSON.stringify(this.myData))

     /** create a chart for the retreived values from sparql endpoint */
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.myData.map(x => x.id),
        datasets: [
          {
            label: 'value',
            data: this.myData.map(x => x.value),
            backgroundColor: 'rgba(255, 205, 86, 9)',borderColor: 'rgba(255, 205, 86, 9)'
          }
        ]
      },
    });


    }), catchError((error: HttpErrorResponse) => {
      console.log('Handling error locally and rethrowing it...', error);
      console.log('error is:' + throwError(error));
      return throwError(error);
    });

    }

    regDevices(deviceNumber : any){

      console.log('device number is'+deviceNumber.target.value);
        // start taking observation with 10 secondes interval

    this.getObservations(deviceNumber.target.value);
    }
   /**
    * this function gets the total devices from a message
    */
  numberOfDevices(){
    this.authService.getDevicesInMsg(localStorage.getItem('clientId'))
    .pipe(first())
    .subscribe(
        data => {
          this.devicesArray.length =0;
          for(let i=0; i<data.length;i++){
          if(this.devicesArray.indexOf(data[i])){
            this.devicesArray.push(i);
          }

          }
        });

  }
  getObservations(deviceNumber:any){

    this.authService.retrieveMsgs(localStorage.getItem('clientId'))
    .pipe(first())
    .subscribe(
        data => {
      let parsed = JSON.parse(JSON.stringify(data));
      // console.log('aree'+ JSON.stringify(parsed[deviceNumber]['@graph'][0]['@graph']));
      let metaData = parsed[deviceNumber]['@graph'][0]['@graph'];
      // iterate over meta data @graph
      metaData.forEach(elementMeta => {
          let metaStr= JSON.stringify(elementMeta);
          let parseMeta = JSON.parse(metaStr)
         // console.log(parseMeta['msg:dateTimeStamp']);
          this.observationTime = parseMeta['msg:dateTimeStamp'];
        });

      let payLoadGraph = parsed[deviceNumber]['@graph'][1]['@graph'];
      payLoadGraph.forEach(element => {
          let ud= JSON.stringify(element);
          let udd = JSON.parse(ud)

          let uddd =JSON.stringify(udd);
          let udddd = JSON.parse(uddd)
          let geosparql =JSON.stringify(udddd['geosparql:asWKT']);

          if(isDefined(geosparql)){
             let geosparql_Parsed = JSON.parse(geosparql);
             let geosparql_Value = geosparql_Parsed['@value'];

             this.geosparql = geosparql_Value;
          }

          if(isDefined(udddd['http://qudt.org/1.1/vocab/unit'])){
            this.unit = udddd['http://qudt.org/1.1/vocab/unit'];
          }
          if(isDefined(udddd['sosa:hasSimpleResult'])){
            let resultStr= JSON.stringify(udddd['sosa:hasSimpleResult']);
            let parseResult= JSON.parse(resultStr);

            this.result = parseResult['@value'];
          }

          if(isDefined(udddd['sosa:madeBySensor'])){
            let sensorIdStr= JSON.stringify(udddd['sosa:madeBySensor']);
            let parseSensorId= JSON.parse(sensorIdStr);

            this.sensorId = parseSensorId['@id'];
          }

        });

        },
        error => {
        console.log(error);
        });
  }
  ngOnDestroy(): void {
     // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    clearInterval(this.timer);

  }

}

  var dringlichkeiten  = [{
    "id": 1,
    "value": 883
}];


export class MyData {
  public id: number;
  public value: number;

  constructor(id: number, value: number){
    this.id = id;
    this.value = value;
  }

}

export class WellbeingReport {
  public key: any;
  public value: number;

  constructor(key: any, value: number){
    this.key = key;
    this.value = value;
  }

}
