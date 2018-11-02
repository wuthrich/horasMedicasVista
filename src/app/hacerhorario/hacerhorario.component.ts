import { Component, OnInit } from '@angular/core';
import { FachadaService } from './../fachada.service';
import { Calendariosemanal } from '../calendariosemanal';
import { Horaslinea } from './../horaslinea';
import { Hora } from './../hora';
import { Horascabezeras } from '../horascabezeras';
import { Router } from '@angular/router';

declare var moment;

@Component({
  selector: 'app-hacerhorario',
  templateUrl: './hacerhorario.component.html',
  styleUrls: ['./hacerhorario.component.css']
})
export class HacerhorarioComponent implements OnInit {

  public calendarios: Array<Calendariosemanal>;
  public calendarioActual: Calendariosemanal;
  public indexCalendario: number;
  public atras: string;
  public adelante: string;
  public desdeComponente: string;
  public hastaComponente: string;
  public longitudHoraComponente: number;
  public lineas: Array<Horaslinea>;
  public seleccionarTodos: boolean = true;
  public horasCabezeras: Horascabezeras;


  constructor(private fachada: FachadaService, private router: Router) { }

 

  actualizar(){

    

    this.fachada.calendarioActualizaTodasHoras(this.calendarioActual)
    .toPromise().then(data => {
      var datosjson = data as any;
      console.log("calendarioActualizado: " + JSON.stringify(datosjson));
      if (datosjson.ok) {
          this.calendarioActual = datosjson.calendarioActualizado;
          this.calendarios[this.indexCalendario] = this.calendarioActual;
          this.pintarTabla();
          
          let horas:Array<Hora>=datosjson.problemasConHorasTomadas;
          if(horas.length>0){
            console.log("problemasConHorasTomadas: "+JSON.stringify(datosjson.problemasConHorasTomadas));            
            let mensaje:string="";
            for(let hora of horas){
              mensaje+= this.fachada.diaEnPalabrasCastellano(hora.dia) +", "+hora.hora+", "+ hora.persona.nombre+"\n";
            }

            alert("No se actualizan horas ya tomadas: \n"+mensaje);
          }else{
            alert("Calendario Actualizado");
          }

      } else {             
        console.log('Problemas al actualizar el calendario' + datosjson.error); 
        if(null!=datosjson.calendarioActualizado){
        this.calendarioActual = datosjson.calendarioActualizado;
        this.calendarios[this.indexCalendario] = this.calendarioActual;  
        this.pintarTabla(); 
        console.log('Calendario Actualizado despues del problema');
        }
        
        if(null!=datosjson.problema){
          alert("Problema al actualizar horas: "+datosjson.problema.razon);
        }else{
          alert("Problema al actualizar horas");
        }
        
      }
    }).catch(error => {            
      console.log('Ha ocurrido un error al llamar el server calendarioActualizaHoras: ', JSON.stringify(error));      
      alert("Error al actualizar"+JSON.stringify(error));
      //this.router.navigate(['/error']);
    });
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

      if (!this.calendarioActual.grabado) {//Es el ultimo calendario, se averigua si esta grabado

        if (!confirm("Se grabara el horario, si se toma una hora no se podra manipular, seguro de seguir!")) {
          return;
        }

        //grabar calendario actual
        this.calendarioActual.grabado = true;
        this.fachada.calendarioPersiste(this.calendarioActual)
          .toPromise().then(data => {
            var datosjson = data as any;
            console.log("calendarioPersiste: " + JSON.stringify(datosjson));
            if (datosjson.ok) {
              console.log('El calendario se guardo exitosamente, hora: ' + datosjson.time);
              let semanaProxima = this.fachada.proximaSemana(this.calendarioActual);//this.calendarioActual.proximaSemana();
              this.calendarios[this.indexCalendario] = semanaProxima;
              this.calendarioActual = this.calendarios[this.indexCalendario];
              this.pintarTabla();
              this.llenarPaginacion();
              console.log("Se crea la proxima semana");
            } else {
              this.calendarioActual.grabado = false;
              --this.indexCalendario;//queda en el mismo calendario
              console.log('Problemas al grabar el calendario' + datosjson.error);
            }
          }).catch(error => {
            this.calendarioActual.grabado = false;
            --this.indexCalendario;//queda en el mismo calendario
            console.log('Ha ocurrido un error al llamar el server calendariosemanal: ', JSON.stringify(error));
            //this.router.navigate(['/error']);
          });

      } else {
        console.log('Se crea calendario nuevo');
        let semanaProxima = this.fachada.proximaSemana(this.calendarioActual);//this.calendarioActual.proximaSemana();
        this.calendarios[this.indexCalendario] = semanaProxima;
        this.calendarioActual = this.calendarios[this.indexCalendario];
        this.pintarTabla();
        this.llenarPaginacion();
      }


    } else { //No esta nulo el siguiente calendario asi que solo se muestra

      this.calendarioActual = this.calendarios[this.indexCalendario];
      this.pintarTabla();
      this.llenarPaginacion();
    }



  }

  salir() {
    if (confirm("Saldrá!")) {
      this.router.navigate(['/medico']);
    }
  }
  
  seleccionarDeseleccionarTodos() {
    this.seleccionarTodos = !this.seleccionarTodos;

    for (let hora of this.calendarioActual.horas) {
      if(!hora.tomada) hora.ofrecida = this.seleccionarTodos;
    }

  }

  botonesEncabezados(boton: number) {
    //console.log("botonesEncabezados: "+ boton );

    switch (boton) {
      case 0:
        this.seleccionarDeseleccionarTodos();
        break;

      case 1:
        this.horasCabezeras.setSeleccionLunes();
        break;

      case 2:
        this.horasCabezeras.setSeleccionMartes();
        break;

      case 3:
        this.horasCabezeras.setSeleccionMiercoles();
        break;

      case 4:
        this.horasCabezeras.setSeleccionJueves();
        break;

      case 5:
        this.horasCabezeras.setSeleccionViernes();
        break;

      case 6:
        this.horasCabezeras.setSeleccionSabado();
        break;

      case 7:
        this.horasCabezeras.setSeleccionDomingo();
        break;

      default:
        break;
    }

  }

  botonesHoras(boton: number) {
    console.log("botonesHoras: " + boton);
    boton--;
    this.lineas[boton].todosSeleccionados = !this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].lunes.tomada)    this.lineas[boton].lunes.ofrecida = this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].martes.tomada)   this.lineas[boton].martes.ofrecida = this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].miercoles.tomada) this.lineas[boton].miercoles.ofrecida = this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].jueves.tomada)   this.lineas[boton].jueves.ofrecida = this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].viernes.tomada)  this.lineas[boton].viernes.ofrecida = this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].sabado.tomada)   this.lineas[boton].sabado.ofrecida = this.lineas[boton].todosSeleccionados;
    if(!this.lineas[boton].domingo.tomada)  this.lineas[boton].domingo.ofrecida = this.lineas[boton].todosSeleccionados;
  }

  private crearPrimerCalendario() {
    //verificar que haya persona seteada en la fachada y setearla en el Calendariosemanal
    let primerCalendario: Calendariosemanal = new Calendariosemanal();

    let anioActual = moment().isoWeekYear();
    let semanaActual = moment().isoWeek();
    let diaActual = moment().isoWeekday();
    let nombreDia = moment().isoWeekday(diaActual);

    let encabezados: Array<any> = new Array(8);
    encabezados[0] = "horas";
    encabezados[1] = moment().isoWeekday(1).format('dddd D');//lunes
    encabezados[2] = moment().isoWeekday(2).format('dddd D');//martes
    encabezados[3] = moment().isoWeekday(3).format('dddd D');//miercoles
    encabezados[4] = moment().isoWeekday(4).format('dddd D');//jueves
    encabezados[5] = moment().isoWeekday(5).format('dddd D');//viernes
    encabezados[6] = moment().isoWeekday(6).format('dddd D');//sabado
    encabezados[7] = moment().isoWeekday(7).format('dddd D');//domingo

    //primerCalendario.personaId = this.fachada.persona.id;
    //primerCalendario.personaNombre = this.fachada.persona.nombre;
    primerCalendario.especialista = this.fachada.medico;
    primerCalendario.anio = anioActual;
    primerCalendario.mes = Number.parseInt(nombreDia.format('M'));
    primerCalendario.semana = semanaActual;
    primerCalendario.diaDeLaSemanaQueSeHizo = diaActual;
    primerCalendario.encabezados = encabezados;
    primerCalendario.grabado = false;
    //Esto se seteara cuando se cambien las horas de trabajo o longitud de la cita
    //primerCalendario.desde = "09:00";
    //primerCalendario.hasta = "18:00";
    //primerCalendario.longitudHora = 10;
    this.desdeComponente = "09:00";
    this.hastaComponente = "18:00";
    this.longitudHoraComponente = 10;

    this.calendarios = new Array();
    this.indexCalendario = 0;
    this.calendarios[this.indexCalendario] = primerCalendario;

    this.calendarioActual = this.calendarios[this.indexCalendario];

    console.log("seteos: " + JSON.stringify(this.calendarioActual));
  }

  hayHorasTomadas(){    
    for(let hora of this.calendarioActual.horas){
      if(hora.tomada){
        return true;                
      }
    }
    return false;
  }

  calcular() {
    console.log("Se calculara");

    
    if(this.hayHorasTomadas()){
      alert("No puede re-calcular horas, si una ha sido tomada");
      return;
    }
    
    if (this.hacerHoras() == 1) {
      console.log("No calzan las horas");
      return;
    }
    this.pintarTabla();
    console.log("Se setean las lineas y cabezeras");
  }

  hacerHoras() {
    //let table = document.getElementById("horario") as HTMLTableElement;
    let desde: Array<string> = this.desdeComponente.split(":");
    let hasta: Array<string> = this.hastaComponente.split(":");

    let desdeHora = moment().hour(Number.parseInt(desde[0])).minute(Number.parseInt(desde[1]));
    let hastaHora = moment().hour(Number.parseInt(hasta[0])).minute(Number.parseInt(hasta[1]));

    let duration: number = moment.duration(hastaHora.diff(desdeHora)).as('minutes');
    let numeroCitas: number = duration / this.longitudHoraComponente;
    let modulo: number = duration % this.longitudHoraComponente;

    numeroCitas = Math.round(numeroCitas);
    modulo = Math.round(modulo);

    console.log(duration + " " + numeroCitas + " modulo: " + modulo);

    if (modulo != 0) {

      alert("Debe adecuar horas trabajadas y longitud de cita para que cuadre el horario, recomendacion usar multiplos de 5 minutos para los 3 tiempos");
      return 1;
    }

    let horas: Array<Hora> = new Array();

    //empieza en 1 por que el numeroCitas es escalar
    for (var linea = 1; linea <= numeroCitas; linea++) {
      //var row = table.insertRow(-1);
      let horaString = desdeHora.format('LT');
      desdeHora = desdeHora.add(this.longitudHoraComponente, 'minutes');

      let lineaHoras: Horaslinea = new Horaslinea();
      lineaHoras.linea = linea;
      lineaHoras.hora = horaString;

      lineaHoras.lunes = new Hora();
      lineaHoras.lunes.linea = linea;
      lineaHoras.lunes.dia = 1;
      lineaHoras.lunes.hora = horaString;
      lineaHoras.lunes.ofrecida = true;
      lineaHoras.lunes.tomada = false;
      horas.push(lineaHoras.lunes);

      lineaHoras.martes = new Hora();
      lineaHoras.martes.linea = linea;
      lineaHoras.martes.dia = 2;
      lineaHoras.martes.hora = horaString;
      lineaHoras.martes.ofrecida = true;
      lineaHoras.martes.tomada = false;
      horas.push(lineaHoras.martes);

      lineaHoras.miercoles = new Hora();
      lineaHoras.miercoles.linea = linea;
      lineaHoras.miercoles.dia = 3;
      lineaHoras.miercoles.hora = horaString;
      lineaHoras.miercoles.ofrecida = true;
      lineaHoras.miercoles.tomada = false;
      horas.push(lineaHoras.miercoles);

      lineaHoras.jueves = new Hora();
      lineaHoras.jueves.linea = linea;
      lineaHoras.jueves.dia = 4;
      lineaHoras.jueves.hora = horaString;
      lineaHoras.jueves.ofrecida = true;
      lineaHoras.jueves.tomada = false;
      horas.push(lineaHoras.jueves);

      lineaHoras.viernes = new Hora();
      lineaHoras.viernes.linea = linea;
      lineaHoras.viernes.dia = 5;
      lineaHoras.viernes.hora = horaString;
      lineaHoras.viernes.ofrecida = true;
      lineaHoras.viernes.tomada = false;
      horas.push(lineaHoras.viernes);

      lineaHoras.sabado = new Hora();
      lineaHoras.sabado.linea = linea;
      lineaHoras.sabado.dia = 6;
      lineaHoras.sabado.hora = horaString;
      lineaHoras.sabado.ofrecida = true;
      lineaHoras.sabado.tomada = false;
      horas.push(lineaHoras.sabado);

      lineaHoras.domingo = new Hora();
      lineaHoras.domingo.linea = linea;
      lineaHoras.domingo.dia = 7;
      lineaHoras.domingo.hora = horaString;
      lineaHoras.domingo.ofrecida = true;
      lineaHoras.domingo.tomada = false;
      horas.push(lineaHoras.domingo);

    }

    this.calendarioActual.desde = this.desdeComponente;
    this.calendarioActual.hasta = this.hastaComponente;
    this.calendarioActual.longitudHora = this.longitudHoraComponente;
    this.calendarioActual.numeroCitas = numeroCitas;
    this.calendarioActual.horas = horas;

    //console.log(JSON.stringify(this.calendarioActual));

  }

  pintarTabla() {
    this.lineas = this.fachada.devolverLineasDeHoras(this.calendarioActual.horas);
    this.horasCabezeras = this.fachada.devolverDiasDeHoras(this.calendarioActual.horas);
    this.desdeComponente = this.calendarioActual.desde;
    this.hastaComponente = this.calendarioActual.hasta;
    this.longitudHoraComponente = this.calendarioActual.longitudHora;
  }

  ngOnInit() {

    if (null == this.fachada.medico) {
      this.router.navigate(['/medico']);
    }

    let anioActual = moment().isoWeekYear();
    let semanaActual = moment().isoWeek();
    this.fachada.calendariosLoad(this.fachada.medico.id, anioActual, semanaActual)
      .toPromise().then(data => {
        var datosjson = data as any;
        console.log("calendariosLoad: " + JSON.stringify(datosjson));
        if (datosjson.traedatos) {
          this.calendarios = datosjson.calendarios;
          this.indexCalendario = this.calendarios.length - 1;
          this.calendarioActual = this.calendarios[this.indexCalendario];
          this.llenarPaginacion();
          this.pintarTabla();                  
        } else {
          console.log('No hay calendarios en Base de datos se hara el primero');
          this.crearPrimerCalendario();
          this.hacerHoras();
          this.pintarTabla();
        }
      }).catch(error => {
        console.log('Ha ocurrido un error al llamar el server calendariosLoad: ', JSON.stringify(error));
        //this.router.navigate(['/error']);
      });



  }



}
