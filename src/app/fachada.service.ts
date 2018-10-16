import { Injectable } from '@angular/core';
import { Opcionselect } from './opcionselect'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Persona } from './persona';
import { Horaslinea } from './horaslinea';
import { Hora } from './hora';
import { Horascabezeras } from './horascabezeras';
import { Calendariosemanal } from './calendariosemanal';

declare var moment;

@Injectable({
  providedIn: 'root'
})
export class FachadaService {

  url: string;
  private regiones: Opcionselect[];
  private comunas: Opcionselect[];
  private centros: Opcionselect[];
  private especialidades: Opcionselect[];
  public persona: Persona;

  constructor(private http: HttpClient, private router: Router) {
    this.url = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port != "") {
      this.url += ":" + window.location.port;
    }

    if (window.location.port == "4200") {
      this.url = "http://localhost:8080";
    }


  }

     /**
    * Le suma una semana a calendario y copia los demas datos
    * exepto el atributo grabado que lo deja como falso    * 
    */
   proximaSemana(calendario:Calendariosemanal){    
    let clon=new Calendariosemanal();
    let semanaProxima = moment().isoWeekYear(calendario.anio).isoWeek(calendario.semana).add(1, 'w');
        
    let encabezados: Array<any> = new Array(8);
    encabezados[0] = "horas";
    encabezados[1] = semanaProxima.isoWeekday(1).format('dddd D');//lunes
    encabezados[2] = semanaProxima.isoWeekday(2).format('dddd D');//martes
    encabezados[3] = semanaProxima.isoWeekday(3).format('dddd D');//miercoles
    encabezados[4] = semanaProxima.isoWeekday(4).format('dddd D');//jueves
    encabezados[5] = semanaProxima.isoWeekday(5).format('dddd D');//viernes
    encabezados[6] = semanaProxima.isoWeekday(6).format('dddd D');//sabado
    encabezados[7] = semanaProxima.isoWeekday(7).format('dddd D');//domingo

    clon.personaId=calendario.personaId;
    clon.personaNombre=calendario.personaNombre;

    clon.anio= Number.parseInt(semanaProxima.format('YYYY'));
    clon.mes= Number.parseInt(semanaProxima.format('M'));
    clon.semana= Number.parseInt(semanaProxima.format('W'));        
    clon.diaDeLaSemanaQueSeHizo=moment().isoWeekday();
    
    clon.encabezados = encabezados;

    clon.desde = calendario.desde;
    clon.hasta = calendario.hasta;
    clon.longitudHora = calendario.longitudHora;
    clon.numeroCitas = calendario.numeroCitas;

    //Transformamos el array a un string y luego lo parseamos a un json para clonarlo        
    let horas = JSON.parse(JSON.stringify(calendario.horas));
    //Dejamos todas las horas como no tomadas
    for(let hora of horas){
        delete hora.tomada;
        delete hora.persona;
    }
    clon.horas = horas;

    clon.grabado = false;

    return clon;
}

  calendarioPersiste(calendarioSemanal: Calendariosemanal) {    

    return this.http.put(this.url + '/rest/calendariosemanal', calendarioSemanal, { responseType: 'json' });

  }

  calendariosLoad(personaId: string, anio:number, semana:number) {
    return this.http.get(this.url + '/rest/calendariosemanal/' + personaId+"/"+anio+"/"+semana, { responseType: 'json' });
  }

  personaLoad(id: string) {
    return this.http.get(this.url + '/rest/Persona/' + id, { responseType: 'json' });
  }

  personaPersiste(persona: Persona) {

    this.persona = persona;//Seteamos la persona para que se pueda seguir ocupando en otros componentes

    console.log('Persona se seteo con: ', JSON.stringify(this.persona));
    this.http.post(this.url + '/rest/Persona/', persona, { responseType: 'json' }).toPromise().then(data => {
      var datosjson = data as any;
      console.log("personaUpset: " + JSON.stringify(datosjson));
      if (datosjson.ok) {
        console.log('Sus datos personales se guardaron exitosamente, hora: ' + datosjson.time);
      } else {
        console.log('Problemas al grabar sus datos' + datosjson.error);
      }
    }).catch(error => {
      console.log('Ha ocurrido un error al llamar el server: ', JSON.stringify(error));
      //this.router.navigate(['/error']);
    });

  }

  devolverDiasDeHoras(horas: Array<Hora>) {
    let cabezeras: Horascabezeras=new Horascabezeras();

    for (let hora of horas) {
      switch (hora.dia) {
        case 1:
          cabezeras.lunes.push(hora);
          break;

        case 2:
          cabezeras.martes.push(hora);
          break;

        case 3:
          cabezeras.miercoles.push(hora);
          break;

        case 4:
          cabezeras.jueves.push(hora);
          break;

        case 5:
          cabezeras.viernes.push(hora);
          break;

        case 6:
          cabezeras.sabado.push(hora);
          break;

        case 7:
          cabezeras.domingo.push(hora);
          break;

        default:
          break;
      }
    }

    return cabezeras;
  }

  devolverLineasDeHoras(horas: Array<Hora>) {
    let lineas: Array<Horaslinea> = new Array();

    for (let hora of horas) {

      if (null == lineas[hora.linea - 1]) {
        lineas[hora.linea - 1] = new Horaslinea();
        lineas[hora.linea - 1].linea = hora.linea;//Todas las horas son de la misma linea
        lineas[hora.linea - 1].hora = hora.hora;//Toda la linea tiene la misma hora
      }

      switch (hora.dia) {
        case 1:
          lineas[hora.linea - 1].lunes = hora;
          break;

        case 2:
          lineas[hora.linea - 1].martes = hora;
          break;

        case 3:
          lineas[hora.linea - 1].miercoles = hora;
          break;

        case 4:
          lineas[hora.linea - 1].jueves = hora;
          break;

        case 5:
          lineas[hora.linea - 1].viernes = hora;
          break;

        case 6:
          lineas[hora.linea - 1].sabado = hora;
          break;

        case 7:
          lineas[hora.linea - 1].domingo = hora;
          break;

        default:
          console.log("nunca deveria ver esto de fachada.devolverLineasDeHoras");
          break;
      }

    }

    return lineas;
  }

  /**
   *  Llama a un servicio para traer los datos y almacenarlos en una variable del este objeto
   * si la variable de este objeto fue seteada desde la llamada se devuelve esta variable
   * y no se vuelve a llamar al servicio externo.
   */
  getEspecialidades() {
    return new Promise(resultado => {

      if (null == this.especialidades) {
        this.http.get(this.url + '/rest/combos/E', { responseType: 'json' }).toPromise().then(
          data => {
            let arreglo = data as any;
            this.especialidades = arreglo;
            console.log("las especialidades se solicitaron");
            resultado(this.especialidades);
          }
        ).catch(err => {
          console.log("ocurrio un error al ir a buscar las especialidades: " + JSON.stringify(err));
        });

      } else {
        console.log("las especialidades ya estaban seteadas");
        resultado(this.especialidades);
      }

    });
  }

  /**
*  Llama a un servicio para traer los datos y almacenarlos en una variable del este objeto
* si la variable de este objeto fue seteada desde la llamada se devuelve esta variable
* y no se vuelve a llamar al servicio externo.
*/
  getCentros() {
    return new Promise(resultado => {

      if (null == this.centros) {
        this.http.get(this.url + '/rest/combos/CE', { responseType: 'json' }).toPromise().then(
          data => {
            let arreglo = data as any;
            this.centros = arreglo;
            resultado(this.centros);
          }
        ).catch(err => {
          console.log("ocurrio un error al ir a buscar los centros: " + JSON.stringify(err));
        });

      } else {
        resultado(this.centros);
      }

    });
  }

  /**
*  Llama a un servicio para traer los datos y almacenarlos en una variable del este objeto
* si la variable de este objeto fue seteada desde la llamada se devuelve esta variable
* y no se vuelve a llamar al servicio externo.
*/
  getComunas() {
    return new Promise(resultado => {

      if (null == this.comunas) {
        this.http.get(this.url + '/rest/combos/C', { responseType: 'json' }).toPromise().then(
          data => {
            let arreglo = data as any;
            this.comunas = arreglo;
            resultado(this.comunas);
          }
        ).catch(err => {
          console.log("ocurrio un error al ir a buscar las comunas: " + JSON.stringify(err));
        });

      } else {
        resultado(this.comunas);
      }

    });
  }

  /**
 *  Llama a un servicio para traer los datos y almacenarlos en una variable del este objeto
 * si la variable de este objeto fue seteada desde la llamada se devuelve esta variable
 * y no se vuelve a llamar al servicio externo.
 */
  getRegiones() {
    return new Promise(resultado => {

      if (null == this.especialidades) {
        this.http.get(this.url + '/rest/combos/R', { responseType: 'json' }).toPromise().then(
          data => {
            let arreglo = data as any;
            this.regiones = arreglo;
            resultado(this.regiones);
          }
        ).catch(err => {
          console.log("ocurrio un error al ir a buscar las regiones: " + JSON.stringify(err));
        });

      } else {
        resultado(this.regiones);
      }

    });
  }

}
