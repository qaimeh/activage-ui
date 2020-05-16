import { AuthServiceService } from './../auth-service.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { isDefined } from '@angular/compiler/src/util';

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


  constructor(private authService: AuthServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    // start taking observation with 10 secondes interval
    this.timer = setInterval(_ => {
      this.getObservations();
  }, 10000);

  }

  getObservations(){

    this.authService.retrieveMsgs(localStorage.getItem('clientId'))
    .pipe(first())
    .subscribe(
        data => {
        let parsed= JSON.parse(JSON.stringify(data));

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
