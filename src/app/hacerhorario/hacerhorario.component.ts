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

  private calendarios: Array<Calendariosemanal>;
  private calendarioActual: Calendariosemanal;
  private indexCalendario: number;
  private atras: string;
  private adelante: string;
  private desdeComponente: string;
  private hastaComponente: string;
  private longitudHoraComponente: number;
  private lineas: Array<Horaslinea>;
  private seleccionarTodos: boolean = true;
  private horasCabezeras: Horascabezeras;


  constructor(private fachada: FachadaService, private router: Router) { }

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
    //grabar calendario actual

    if (null == this.calendarios[++this.indexCalendario]) {
      let semanaProxima = this.calendarioActual.proximaSemana();
      this.calendarios[this.indexCalendario] = semanaProxima;
      console.log("Se crea la proxima semana");
    }

    this.calendarioActual = this.calendarios[this.indexCalendario];

    this.pintarTabla();

    this.llenarPaginacion();

  }

  salir() {
    if (confirm("Saldrá!")) {
      this.router.navigate(['/medico']);
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

  seleccionarDeseleccionarTodos() {
    this.seleccionarTodos = !this.seleccionarTodos;

    for (let hora of this.calendarioActual.horas) {
      hora.ofrecida = this.seleccionarTodos;
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
    this.lineas[boton].lunes.ofrecida = this.lineas[boton].todosSeleccionados;
    this.lineas[boton].martes.ofrecida = this.lineas[boton].todosSeleccionados;
    this.lineas[boton].miercoles.ofrecida = this.lineas[boton].todosSeleccionados;
    this.lineas[boton].jueves.ofrecida = this.lineas[boton].todosSeleccionados;
    this.lineas[boton].viernes.ofrecida = this.lineas[boton].todosSeleccionados;
    this.lineas[boton].sabado.ofrecida = this.lineas[boton].todosSeleccionados;
    this.lineas[boton].domingo.ofrecida = this.lineas[boton].todosSeleccionados;
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

    primerCalendario.anio = anioActual;
    primerCalendario.mes = nombreDia.format('M');
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

  calcular() {
    console.log("Se calculara");

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
      horas.push(lineaHoras.lunes);

      lineaHoras.martes = new Hora();
      lineaHoras.martes.linea = linea;
      lineaHoras.martes.dia = 2;
      lineaHoras.martes.hora = horaString;
      lineaHoras.martes.ofrecida = true;
      horas.push(lineaHoras.martes);

      lineaHoras.miercoles = new Hora();
      lineaHoras.miercoles.linea = linea;
      lineaHoras.miercoles.dia = 3;
      lineaHoras.miercoles.hora = horaString;
      lineaHoras.miercoles.ofrecida = true;
      horas.push(lineaHoras.miercoles);

      lineaHoras.jueves = new Hora();
      lineaHoras.jueves.linea = linea;
      lineaHoras.jueves.dia = 4;
      lineaHoras.jueves.hora = horaString;
      lineaHoras.jueves.ofrecida = true;
      horas.push(lineaHoras.jueves);

      lineaHoras.viernes = new Hora();
      lineaHoras.viernes.linea = linea;
      lineaHoras.viernes.dia = 5;
      lineaHoras.viernes.hora = horaString;
      lineaHoras.viernes.ofrecida = true;
      horas.push(lineaHoras.viernes);

      lineaHoras.sabado = new Hora();
      lineaHoras.sabado.linea = linea;
      lineaHoras.sabado.dia = 6;
      lineaHoras.sabado.hora = horaString;
      lineaHoras.sabado.ofrecida = true;
      horas.push(lineaHoras.sabado);

      lineaHoras.domingo = new Hora();
      lineaHoras.domingo.linea = linea;
      lineaHoras.domingo.dia = 7;
      lineaHoras.domingo.hora = horaString;
      lineaHoras.domingo.ofrecida = true;
      horas.push(lineaHoras.domingo);

    }

    this.calendarioActual.desde = this.desdeComponente;
    this.calendarioActual.hasta = this.hastaComponente;
    this.calendarioActual.longitudHora = this.longitudHoraComponente;
    this.calendarioActual.numeroCitas = numeroCitas;
    this.calendarioActual.horas = horas;

    //console.log(JSON.stringify(this.calendarioActual));

  }

  pintarTabla(){
    this.lineas = this.fachada.devolverLineasDeHoras(this.calendarioActual.horas);
    this.horasCabezeras = this.fachada.devolverDiasDeHoras(this.calendarioActual.horas);
  }

  ngOnInit() {

    this.crearPrimerCalendario();
    this.hacerHoras();
    this.pintarTabla();

  }



}
