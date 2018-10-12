import { Hora } from './hora';

export class Horascabezeras {

    lunesSeleccionado:boolean=true;
    lunes:Array<Hora>=new Array();    

    martesSeleccionado:boolean=true;
    martes:Array<Hora>=new Array();

    miercolesSeleccionado:boolean=true;
    miercoles:Array<Hora>=new Array();

    juevesSeleccionado:boolean=true;
    jueves:Array<Hora>=new Array();

    viernesSeleccionado:boolean=true;
    viernes:Array<Hora>=new Array();

    sabadoSeleccionado:boolean=true;
    sabado:Array<Hora>=new Array();

    domingoSeleccionado:boolean=true;
    domingo:Array<Hora>=new Array();

    setSeleccionLunes(){
        this.lunesSeleccionado=!this.lunesSeleccionado;
        
        for(let hora of this.lunes){
            hora.ofrecida=this.lunesSeleccionado;
        }
    }

    setSeleccionMartes(){
        this.martesSeleccionado=!this.martesSeleccionado;
        
        for(let hora of this.martes){
            hora.ofrecida=this.martesSeleccionado;
        }
    }

    setSeleccionMiercoles(){
        this.miercolesSeleccionado=!this.miercolesSeleccionado;
        
        for(let hora of this.miercoles){
            hora.ofrecida=this.miercolesSeleccionado;
        }
    }

    setSeleccionJueves(){
        this.juevesSeleccionado=!this.juevesSeleccionado;
        
        for(let hora of this.jueves){
            hora.ofrecida=this.juevesSeleccionado;
        }
    }

    setSeleccionViernes(){
        this.viernesSeleccionado=!this.viernesSeleccionado;
        
        for(let hora of this.viernes){
            hora.ofrecida=this.viernesSeleccionado;
        }
    }

    setSeleccionSabado(){
        this.sabadoSeleccionado=!this.sabadoSeleccionado;
        
        for(let hora of this.sabado){
            hora.ofrecida=this.sabadoSeleccionado;
        }
    }

    setSeleccionDomingo(){
        this.domingoSeleccionado=!this.domingoSeleccionado;
        
        for(let hora of this.domingo){
            hora.ofrecida=this.domingoSeleccionado;
        }
    }
}
