import { Component, OnInit } from '@angular/core';
import { FachadaService } from './../fachada.service';
import { Calendariosemanal } from '../calendariosemanal';
import { Horaslinea } from './../horaslinea';
import { Hora } from './../hora';
import { Horascabezeras } from '../horascabezeras';
import { Router } from '@angular/router';

declare var moment;

@Component({
  selector: 'app-tomarhora',
  templateUrl: './tomarhora.component.html',
  styleUrls: ['./tomarhora.component.css']
})
export class TomarhoraComponent implements OnInit {

  private calendarios: Array<Calendariosemanal>;
  private calendarioActual: Calendariosemanal;
  private indexCalendario: number;
  private atras: string;
  private adelante: string;
  //private desdeComponente: string;
  //private hastaComponente: string;
  //private longitudHoraComponente: number;
  private lineas: Array<Horaslinea>;
  private seleccionarTodos: boolean = true;
  private horasCabezeras: Horascabezeras;


  constructor(private fachada: FachadaService, private router: Router) { }

  actualizar(){
    
  }

  llenarPaginacion() {
    this.atras = "";
    this.adelante = "";
    for (let calendario of this.calendarios) {
      if (this.calendarioActual.semana > calendario.semana) {
        this.atras += calendario.semana + "- ";
      }

      if (this.calendarioActual.semana < calendario.semana) {
        this.adelante += " -" + calendario.semana;
      }

    }

  }

  retroceder() {
    this.calendarioActual = this.calendarios[--this.indexCalendario];
    this.llenarPaginacion();

    this.pintarTabla();
  }

  seguir() {

    if (null == this.calendarios[++this.indexCalendario]) {
      alert("Ultimo calendario disponible por el momento");
    } else { //No esta nulo el siguiente calendario asi que se muestra
      this.calendarioActual = this.calendarios[this.indexCalendario];
      this.pintarTabla();
      this.llenarPaginacion();
    }



  }

  salir() {
    if (confirm("Saldrá!")) {
      this.router.navigate(['/paciente']);
    }
  }

  public probar() {
    //let semanaActual = moment().isoWeekYear(this.calendarioActual.anio).isoWeek(this.calendarioActual.semana);
    let semanaActual = moment().isoWeekYear(2018).isoWeek(42).add(1, 'w');
    console.log("semana: " + JSON.stringify(semanaActual));
    console.log(semanaActual.format('YYYY M W'));
    console.log("dia: " + semanaActual.isoWeekday());

    let encabezados: Array<any> = new Array(8);
    encabezados[0] = "horas";
    encabezados[1] = semanaActual.isoWeekday(1).format('dddd D');//lunes
    encabezados[2] = semanaActual.isoWeekday(2).format('dddd D');//martes
    encabezados[3] = semanaActual.isoWeekday(3).format('dddd D');//miercoles
    encabezados[4] = semanaActual.isoWeekday(4).format('dddd D');//jueves
    encabezados[5] = semanaActual.isoWeekday(5).format('dddd D');//viernes
    encabezados[6] = semanaActual.isoWeekday(6).format('dddd D');//sabado
    encabezados[7] = semanaActual.isoWeekday(7).format('dddd D');//domingo

    let mostrar: string = "";
    for (let cabeza of encabezados) {
      mostrar += cabeza + " ";
    }

    console.log(mostrar);

  }

  pintarTabla() {
    this.lineas = this.fachada.devolverLineasDeHoras(this.calendarioActual.horas);
    this.horasCabezeras = this.fachada.devolverDiasDeHoras(this.calendarioActual.horas);   
  }

  ngOnInit() {

    if (null == this.fachada.paciente || null == this.fachada.persona) {
      this.router.navigate(['/paciente']);
    }

    let anioActual = moment().isoWeekYear();
    let semanaActual = moment().isoWeek();
    this.fachada.calendariosLoad(this.fachada.persona.id, anioActual, semanaActual)
      .toPromise().then(data => {
        var datosjson = data as any;        
        if (datosjson.traedatos) {
          this.calendarios = datosjson.calendarios;
          this.indexCalendario = this.calendarios.length - 1;
          this.calendarioActual = this.calendarios[this.indexCalendario];
          this.llenarPaginacion();
          this.pintarTabla();                  
        } 
        /* Tiene que traer datos
        else {
          console.log('No hay calendarios en Base de datos se hara el primero');
          this.crearPrimerCalendario();
          this.hacerHoras();
          this.pintarTabla();
        }*/

      }).catch(error => {
        console.log('Ha ocurrido un error al llamar el server calendariosLoad: ', JSON.stringify(error));
        //this.router.navigate(['/error']);
      });



  }
}
