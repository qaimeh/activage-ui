import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { QuerymodelService } from './../semantic-web/querymodel.service';
import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { first, catchError } from 'rxjs/operators';
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
  timer: any;
  sub: any;
  showDiv = false;
  sensorId: any;
  geosparql: any;
  result: any;
  unit: any;
  observeProp: any;
  observes: any;
  observationTime: any;
  chart: Chart;
  myData: MyData[] = [];
  devicesArray = [];
  deviceArrayFromSparql = [];
  deviceURI: string;
  wellBeingReport: WellbeingReport[] = [];
  resourceObservations: ResourceObservations [] = [];
  wellComeClientMsg: any;
  rsr: string;

  constructor(private http: HttpClient, private authService: AuthServiceService) {
    this.wellComeClientMsg = localStorage.getItem('clientId');
    this.rsr= 'http://openiot/resource/59';
  }

  ngOnInit(): void {
    /*
          if(this.timer!=null)
          clearInterval(this.timer);

        this.timer = setInterval(_ => {
          //this.getObservations(0);
      }, 10000);*/
  }

  ngAfterViewInit(): void {
    // this will get the device from the observation msg
    this.numberOfDevices();
    // this will get the devices for this client from the SPARQL endpoint
    this.queryClient4DeviceSubs();
  }

  getReport(e) {
    let num = e.target.value
    let dayStartEnd = num.split("-", 2);
    this.getAVG_MIN_MAX(dayStartEnd);
    // to popup the graph (at the moment is dummy data will have to populate with real data)
    this.querySparqlEndpoint(dayStartEnd);
  }

  wellBeing(deviceNumber: any) {
    // set the deviceURI value which is used in radio button function
    this.deviceURI = deviceNumber.target.value;
    this.showDiv = true;
  }

  /**
   * this function query the avarage max and min values from sparql endpoint
   */
  getAVG_MIN_MAX(dayStartEnd: number) {

const queryStr = `SELECT (AVG(?results) AS ?avg)
(MIN(?results) AS ?min)
(MAX(?results) AS ?max)
WHERE {

select ?results {
<http://openiot.eu/resource/${localStorage.getItem('clientId')}>   a       <http://openiot.eu/resource/Client>;
<http://openiot.eu/resource/deviceSubscription> ?deviceSub.

?deviceSub <http://openiot.eu/ontology/category> ?category.

?observation  <http://www.w3.org/ns/sosa/madeBySensor> ?deviceSub.

?observation  <http://inter-iot.eu/message/dateTimeStamp> ?timeStamp.

?observation  <http://www.w3.org/ns/sosa/hasSimpleResult> ?results.

BIND (bif:datediff('day', xsd:DateTime(?timeStamp),now() ) AS ?duration)

FILTER ( ?duration >= ${dayStartEnd[0]} && ?duration <= ${dayStartEnd[1]} )

Filter (?deviceSub = <${this.deviceURI}>)
} group by ?results
}`;

    // console.log(queryStr);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, */*'
    });

    const params = new HttpParams()
      .set('query', queryStr)
      // .set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
      .set('format', 'json');

    const opt = {
      params: params,
      headers: headers

    }

    this.http.get('http://localhost:8890/sparql', opt).subscribe((data: Response) => {
      console.log(data);
      let prsRslt = JSON.parse(JSON.stringify(data));
      let results = prsRslt.results.bindings;

      // clear the old data in array if existed
      this.wellBeingReport.length = 0;
      for (let result in results) {
        let values = results[result];
        for (let val in values) {
          // first parameter of wellbeingReport is:
          //  a key (ie., avg, max, min)
          // and second param is a property (ie., avg, max, min values )
          this.wellBeingReport.push(new WellbeingReport(val, values[val].value))
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
  queryClient4DeviceSubs() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, */*'
    });

    const params = new HttpParams()
      .set('query', 'SELECT ?deviceSub  {<http://openiot.eu/resource/' + localStorage.getItem('clientId') + '>   a       <http://openiot.eu/resource/Client>; <http://openiot.eu/resource/deviceSubscription> ?deviceSub. }')
      // .set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
      .set('format', 'json');

    const opt = {
      params: params,
      headers: headers

    }

    this.http.get('http://localhost:8890/sparql', opt).subscribe((data: Response) => {
      console.log(data);
      let prsRslt = JSON.parse(JSON.stringify(data));
      let results = prsRslt.results.bindings;
      this.deviceArrayFromSparql.length = 0;// = [];
      for (let result in results) {
        let values = results[result];
        for (let val in values) {
          this.deviceArrayFromSparql.push(values[val].value);

        }
      }

    }), catchError((error: HttpErrorResponse) => {
      console.log('Handling error locally and rethrowing it...', error);
      console.log('error is:' + throwError(error));
      return throwError(error);
    });
  }

  querySparqlEndpoint(dayStartEnd: number) {
  const eachDay_AVG_Query = `
  SELECT DISTINCT ?duration (AVG(?results) as ?avgresults)
  {
  SELECT ?results ?duration {
  <http://openiot.eu/resource/${localStorage.getItem('clientId')}>    a       <http://openiot.eu/resource/Client>;

  <http://openiot.eu/resource/deviceSubscription> ?deviceSub.

  ?deviceSub <http://openiot.eu/ontology/category> ?category.

  ?observation  <http://www.w3.org/ns/sosa/madeBySensor> ?deviceSub.

  ?observation  <http://inter-iot.eu/message/dateTimeStamp> ?timeStamp.

  ?observation  <http://www.w3.org/ns/sosa/hasSimpleResult> ?results.

  BIND (bif:datediff('day', xsd:DateTime(?timeStamp),now() ) AS ?duration)

  FILTER ( ?duration >= ${dayStartEnd[0]} && ?duration <= ${dayStartEnd[1]} )

  Filter (?deviceSub = <${this.deviceURI}>)
  } group by ?results
  } order by ?duration`;

    console.log(eachDay_AVG_Query);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, */*'
    });

    const params = new HttpParams()
    // .set('query',' SELECT ?results  FROM <http://activage.uix.dumy.data> WHERE {  <http://openiot.eu/resource/client/c10> <http://www.w3.org/ns/sosa/subscribedTo> ?o. ?o <http://www.w3.org/ns/sosa/hasSimpleResult> ?results. }   limit '+num)
    //  .set('query', 'INSERT DATA { GRAPH <urn:sparql:tests:insert:data>  { <http://aa> <http://bb> \'dd\' .  } }')
    .set('query', eachDay_AVG_Query)
    .set('format', 'json');

    const opt = {
      params: params,
      headers: headers

    }


    this.http.get('http://localhost:8890/sparql', opt).subscribe((data: Response) => {
      this.myData.length = 0;
      let prsRslt = JSON.parse(JSON.stringify(data));
      console.log(JSON.stringify(prsRslt));
      let results = prsRslt.results.bindings;

      for (let result in results) {
        let values = results[result];
        //console.log('duaration is :' +values.duration.value +' and avgis: '+ values.avgresults.value )
        const data = new MyData(values.duration.value, values.avgresults.value);
        this.myData.push(data);

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
              backgroundColor: 'rgba(255, 205, 86, 9)', borderColor: 'rgba(255, 205, 86, 9)'
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

  regDevices(deviceNumber: any) {

    console.log('device number is' + deviceNumber.target.value);
    // start taking observation with 10 secondes interval

    if (this.timer != null)
      clearInterval(this.timer);

    this.timer = setInterval(_ => {
      this.getObservations(deviceNumber.target.value);
    }, 10000);

    //this.getObservations(deviceNumber.target.value);
  }
  /**
   * this function gets the total devices from a message
   */
  numberOfDevices() {
    this.authService.getDevicesInMsg(localStorage.getItem('clientId'))
      .pipe(first())
      .subscribe(
        data => {
          this.devicesArray.length = 0;
          for (let i = 0; i < data.length; i++) {
            if (this.devicesArray.indexOf(data[i])) {
              this.devicesArray.push(i);
            }

          }
        });

  }
  /**
   * observation is retreived from AIOTES, and the messages can have multiple devices
   * param: the device number based on the device is selected from observation message to show in html
   */
  getObservations(deviceNumber: any) {

    this.authService.retrieveMsgs(localStorage.getItem('clientId'))
      .pipe(first())
      .subscribe(
        data => {
          // clear the array before each message
          this.resourceObservations.length=0;

          let parsed = JSON.parse(JSON.stringify(data));
          let metaData = parsed[deviceNumber]['@graph'][0]['@graph'];
          // iterate over meta data @graph
          metaData.forEach(elementMeta => {
            let parseMeta = JSON.parse(JSON.stringify(elementMeta));
           // this.observationTime = parseMeta['msg:dateTimeStamp'];
            this.resourceObservations.push(new ResourceObservations('TIME', parseMeta['msg:dateTimeStamp']));
          });

          let payLoadGraph = parsed[deviceNumber]['@graph'][1]['@graph'];
         // console.log(JSON.stringify(payLoadGraph));
          payLoadGraph.forEach(element => {
            let payloadObjects = JSON.parse(JSON.stringify(element));


            if (isDefined(payloadObjects['geosparql:asWKT'])){
            //  this.geosparql = payloadObjects['geosparql:asWKT']['@value'];
              this.resourceObservations.push(new ResourceObservations('GEO', payloadObjects['geosparql:asWKT']['@value'] ));
            }
            if (isDefined(payloadObjects['http://qudt.org/1.1/vocab/unit'])) {
             // this.unit = payloadObjects['http://qudt.org/1.1/vocab/unit'];
              this.resourceObservations.push(new ResourceObservations('UNIT', payloadObjects['http://qudt.org/1.1/vocab/unit'] ));
            }
            if (isDefined(payloadObjects['sosa:hasSimpleResult'])) {
              // ** temporarily commented out because this value from db is static
              // ** we need real device values (i.e., variations in values)
              // this.result = payloadObjects['sosa:hasSimpleResult']['@value'];
              // this.result = this.getRandomInt();
              this.resourceObservations.push(new ResourceObservations('RESULT', this.getRandomInt()));
            }
            if (isDefined(payloadObjects['sosa:madeBySensor'])) {
              // this.sensorId = this.charAfterLastSlash(payloadObjects['sosa:madeBySensor']['@id']);
              this.resourceObservations.push(new ResourceObservations('SENSOR_ID', this.charAfterLastSlash(payloadObjects['sosa:madeBySensor']['@id']) ));
            }
            if (isDefined(payloadObjects['sosa:observedProperty'])) {
              // this.observeProp = this.charAfterLastSlash(payloadObjects['sosa:observedProperty']['@id']);
              this.resourceObservations.push(new ResourceObservations('OBS_PROPERTY', this.charAfterLastSlash(payloadObjects['sosa:observedProperty']['@id'])));
            }
            if (isDefined(payloadObjects['sosa:observes'])) {
              // this.observes = this.charAfterLastSlash(payloadObjects['sosa:observes']['@id']);
              this.resourceObservations.push(new ResourceObservations('OBSERVES', this.charAfterLastSlash(payloadObjects['sosa:observes']['@id'])));
            }

          });

          //this.resourceObservations.map(x => this.printMe('keys are: ' + x.key));
          //this.resourceObservations.includes("http://openiot/resource/59");
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

/**
 *  randomize values of results (in, real-world case these should be live values from sensors)
 */
getRandomInt() {
let min = 5;
let max = 100;

  let randomValue =   Math.floor(Math.random() * (max - min + 1) + min);
  return Math.floor(Math.round(randomValue * 100) / 100).toFixed(2);
}

/**
 * character afte last slash in URL
 */
 charAfterLastSlash(urlString: any ){
  return urlString.substr(urlString.lastIndexOf('/') + 1);
 }

/**
 * to print the json
*/
printJSON(json: any){
  console.log(JSON.stringify(json));
}

/**
 * just a print
 */
 printMe(value: any){
  console.log(value);
 }
}

export class MyData {
  public id: any;
  public value: any;

  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }

}

export class ResourceObservations{
  public key: any;
  public value: any;
  constructor(key: any, value: any){
    this.key = key;
    this.value = value;
  }
}
export class WellbeingReport {
  public key: any;
  public value: any;

  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
  }

}
