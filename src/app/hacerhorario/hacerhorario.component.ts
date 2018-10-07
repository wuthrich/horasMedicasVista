import { Component, OnInit } from '@angular/core';

declare var moment;

@Component({
  selector: 'app-hacerhorario',
  templateUrl: './hacerhorario.component.html',
  styleUrls: ['./hacerhorario.component.css']
})
export class HacerhorarioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var startOfWeek = moment().startOf('isoWeek');
    var endOfWeek = moment().endOf('isoWeek');

    var days = [];
    var day = startOfWeek;

    while (day <= endOfWeek) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }

    console.log(JSON.stringify(days));

    //moment.locale('en');
    //var localLocale = moment('1993-10-23 00:00:00');    
    //console.log(localLocale.format('LLLL'));

    var añoActual= moment().isoWeekYear();
    var semanaActual =moment().isoWeek();
    var diaActual = moment().isoWeekday() ;
    var nombreDia = moment().isoWeekday(diaActual);

    var lunes = moment().isoWeekday(1);
    var martes = moment().isoWeekday(2);
    var miercoles = moment().isoWeekday(3);
    var jueves = moment().isoWeekday(4);
    var viernes = moment().isoWeekday(5);
    var sabado = moment().isoWeekday(6);
    var domingo = moment().isoWeekday(7);

    console.log(añoActual+" "+semanaActual+ " " +diaActual+ " "+nombreDia.format('dddd YYYY MM DD'));
    //console.log( JSON.stringify(nombreDia) + " " + nombreDia.format('dddd'));
    console.log(lunes.format('dddd MM DD')+", "+martes.format('dddd MM DD')+", "+miercoles.format('dddd MM DD')+", "+jueves.format('dddd MM DD')+", "+viernes.format('dddd MM DD')+", "+sabado.format('dddd MM DD')+", "+domingo.format('dddd MM DD'));

    console.log("-----------------------------");

    
    

  }

}
