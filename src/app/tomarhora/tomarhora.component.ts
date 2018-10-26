import { Component, OnInit } from '@angular/core';
import { FachadaService } from './../fachada.service';
import { Calendariosemanal } from '../calendariosemanal';
import { Horaslinea } from './../horaslinea';
import { Hora } from './../hora';
import { Horascabezeras } from '../horascabezeras';
import { Router } from '@angular/router';
//import { Horatomada } from '../horatomada';

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

  prueba(){
    console.log("Hora: "+JSON.stringify(this.calendarioActual.horas));
  }

  dejar(hora: Hora){
    console.log("Dejar Hora: "+JSON.stringify(hora));
    if (!confirm("Dejar!")) {
      return false;  
    }

    hora.tomada = false;
    //hora.persona = this.fachada.paciente;

    this.fachada.calendarioActualizaHora(this.calendarioActual, hora)
    .toPromise().then(data => {
      var datosjson = data as any;
      console.log("calendarioActualizado: " + JSON.stringify(datosjson));
      if (datosjson.ok) {
          this.calendarioActual = datosjson.calendarioActualizado;
          this.calendarios[this.indexCalendario] = this.calendarioActual;          
          //this.llenarPaginacion();
          this.pintarTabla();  
      } else {             
        console.log('Problemas al actualizar el calendario' + datosjson.error);              
        return false;
      }
    }).catch(error => {            
      console.log('Ha ocurrido un error al llamar el server calendarioActualizaHoras: ', JSON.stringify(error));
      return false;
      //this.router.navigate(['/error']);
    });
  }

  tomar(hora: Hora){
    console.log("Tomar Hora: "+JSON.stringify(hora));
    if (!confirm("Tomar!")) {
      return false;  
    }

    hora.tomada = true;
    hora.persona = this.fachada.paciente;

    this.fachada.calendarioActualizaHora(this.calendarioActual, hora)
    .toPromise().then(data => {
      var datosjson = data as any;
      console.log("calendarioActualizado: " + JSON.stringify(datosjson));
      if (datosjson.ok) {
          this.calendarioActual = datosjson.calendarioActualizado;
          this.calendarios[this.indexCalendario] = this.calendarioActual;          
          //this.llenarPaginacion();
          this.pintarTabla();  
      } else {             
        console.log('Problemas al actualizar el calendario' + datosjson.error);              
        return false;
      }
    }).catch(error => {            
      console.log('Ha ocurrido un error al llamar el server calendarioActualizaHoras: ', JSON.stringify(error));
      return false;
      //this.router.navigate(['/error']);
    });

    /*
    for(let horaCalendario of this.calendarioActual.horas ){
      if(horaCalendario.dia == hora.dia && horaCalendario.linea == hora.linea){
        console.log("horaCalendario: "+JSON.stringify(horaCalendario));
        horaCalendario.tomada = true;
        horaCalendario.persona = this.fachada.paciente;
        break;
      }
    }
    */

    /*
    let tomada:Horatomada = new Horatomada();
    tomada.especialista = this.calendarioActual.especialista;
    tomada.anio = this.calendarioActual.anio;
    tomada.semana = this.calendarioActual.semana;
    tomada.dia = hora.dia;
    tomada.hora = hora.hora;
    tomada.linea = hora.linea;
    */
    
    /*
    this.fachada.calendarioPersiste(this.calendarioActual)
          .toPromise().then(data => {
            var datosjson = data as any;
            console.log("calendarioActualizado: " + JSON.stringify(datosjson));
            if (datosjson.ok) {
              console.log('El calendario se guardo exitosamente, hora: ' + datosjson.time);
              //this.router.navigate(['/paciente']);
              this.pintarTabla();
            } else {             
              console.log('Problemas al actualizar el calendario' + datosjson.error);              
              return false;
            }
          }).catch(error => {            
            console.log('Ha ocurrido un error al llamar el server calendarioActualizaHoras: ', JSON.stringify(error));
            return false;
            //this.router.navigate(['/error']);
          });
          */
          

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
      return;
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

  pintarTabla() {
    this.lineas = this.fachada.devolverLineasDeHoras(this.calendarioActual.horas); 
    this.horasCabezeras = this.fachada.devolverDiasDeHoras(this.calendarioActual.horas);   
  }

  ngOnInit() {

    if (null == this.fachada.paciente || null == this.fachada.medico) {
      this.router.navigate(['/paciente']);
    }

    let anioActual = moment().isoWeekYear();
    let semanaActual = moment().isoWeek();
    this.fachada.calendariosLoad(this.fachada.medico.id, anioActual, semanaActual)
      .toPromise().then(data => {
        var datosjson = data as any;        
        if (datosjson.traedatos) {
          this.calendarios = datosjson.calendarios;
          this.indexCalendario = this.calendarios.length - 1;
          this.calendarioActual = this.calendarios[this.indexCalendario];
          console.log('calendarioActual: '+ JSON.stringify(this.calendarioActual));
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
