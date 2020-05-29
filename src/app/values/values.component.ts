import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { QuerymodelService } from './../semantic-web/querymodel.service';
import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { first, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { isDefined } from '@angular/compiler/src/util';
import { throwError } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit {

  title = 'values';
  private timer: any;
  sub: any;

  sensorId: any;
  geosparql: any;
  result: any;
  unit: any;
  observationTime: any;
  chart: Chart;
  private myData: MyData [] = [];



  constructor(private http: HttpClient,
    private authService: AuthServiceService,
    private route: ActivatedRoute,
    private qryModel: QuerymodelService) { }

  ngOnInit(): void {

    // start taking observation with 10 secondes interval
    this.timer = setInterval(_ => {
      this.getObservations();
  }, 10000);

  }


  getReport(e){

    let num =e.target.value
    this.querySparqlEndpoint(num);






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
    this.myData.length=0;// = [];
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


  getObservations(){

    this.authService.retrieveMsgs(localStorage.getItem('clientId'))
    .pipe(first())
    .subscribe(
        data => {
        let parsed= JSON.parse(JSON.stringify(data));

        // ----------------------------------//
        // here, a call to functio that rdfize it again, with some other paramters, and dumpm into virtuoso
          this.qryModel.createModel(parsed)
        // -----------------------------------//

        let metaData= parsed[0]['@graph'][0]['@graph'];

        // iterate over meta data @graph
        metaData.forEach(elementMeta => {
          let metaStr= JSON.stringify(elementMeta);
          let parseMeta = JSON.parse(metaStr)
          console.log(parseMeta['msg:dateTimeStamp']);
          this.observationTime = parseMeta['msg:dateTimeStamp'];
        });

        let payLoadGraph = parsed[0]['@graph'][1]['@graph'];


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
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
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
