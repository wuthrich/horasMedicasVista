import { Hora } from './hora';
import { Persona } from './persona';

declare var moment;

export class Calendariosemanal {    
    especialista:Persona;    
    anio:number;
    mes:number;
    semana:number;
    diaDeLaSemanaQueSeHizo:number;
    encabezados:Array<any>;
    desde:string;
    hasta:string;
    longitudHora:number;
    numeroCitas:number;
    horas:Array<Hora>;
    grabado:boolean;

   /**
    * nunca poner metodos en el pojo (Se nota que vengo de Java) porque al setearlo con 
    * datos de un servicio Se pierde su contenido    * 
    * 
    * Le suma una semana a this y copia los demas datos
    * exepto el atributo grabado que lo deja como falso    * 
    
    proximaSemana(){
        console.log('entro en proximaSemana');
        let clon=new Calendariosemanal();
        let semanaProxima = moment().isoWeekYear(this.anio).isoWeek(this.semana).add(1, 'w');
            
        let encabezados: Array<any> = new Array(8);
        encabezados[0] = "horas";
        encabezados[1] = semanaProxima.isoWeekday(1).format('dddd D');//lunes
        encabezados[2] = semanaProxima.isoWeekday(2).format('dddd D');//martes
        encabezados[3] = semanaProxima.isoWeekday(3).format('dddd D');//miercoles
        encabezados[4] = semanaProxima.isoWeekday(4).format('dddd D');//jueves
        encabezados[5] = semanaProxima.isoWeekday(5).format('dddd D');//viernes
        encabezados[6] = semanaProxima.isoWeekday(6).format('dddd D');//sabado
        encabezados[7] = semanaProxima.isoWeekday(7).format('dddd D');//domingo

        clon.personaId=this.personaId;
        clon.personaNombre=this.personaNombre;

        clon.anio= Number.parseInt(semanaProxima.format('YYYY'));
        clon.mes= Number.parseInt(semanaProxima.format('M'));
        clon.semana= Number.parseInt(semanaProxima.format('W'));        
        clon.diaDeLaSemanaQueSeHizo=moment().isoWeekday();
        
        clon.encabezados = encabezados;

        clon.desde = this.desde;
        clon.hasta = this.hasta;
        clon.longitudHora = this.longitudHora;
        clon.numeroCitas = this.numeroCitas;

        //Transformamos el array a un string y luego lo parseamos a un json para clonarlo        
        let horas = JSON.parse(JSON.stringify(this.horas));
        //Dejamos todas las horas como no tomadas
        for(let hora of horas){
            delete hora.tomada;
            delete hora.persona;
        }
        clon.horas = horas;

        clon.grabado = false;

        return clon;
    }*/
}
