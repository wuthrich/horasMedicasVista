import { Injectable } from '@angular/core';
import { Opcionselect } from './opcionselect'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Persona } from './persona';

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

  personaLoad(id:string) {       
    return this.http.get(this.url+'/rest/Persona/'+id, {responseType: 'json'}); 
  }
 
  personaPersiste(persona:Persona){

    this.persona=persona;//Seteamos la persona para que se pueda seguir ocupando en otros componentes

    this.http.post(this.url+'/rest/Persona/', persona ,{responseType: 'json'}).toPromise().then(data=>{
      var datosjson=data as any;
      console.log("personaUpset: "+JSON.stringify(datosjson));
      if(datosjson.ok){
        console.log('Sus datos personales se guardaron exitosamente, hora: '+datosjson.time);
      }else{
        console.log('Problemas al grabar sus datos'+datosjson.error);
      }
    }).catch(error=>{
      console.log('Ha ocurrido un error al llamar el server: ',JSON.stringify(error));
      //this.router.navigate(['/error']);
    });

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
        ).catch(err=>{
          console.log("ocurrio un error al ir a buscar las especialidades: "+JSON.stringify(err) );
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
        ).catch(err=>{
          console.log("ocurrio un error al ir a buscar los centros: "+JSON.stringify(err) );
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
        ).catch(err=>{
          console.log("ocurrio un error al ir a buscar las comunas: "+JSON.stringify(err) );
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
        ).catch(err=>{
          console.log("ocurrio un error al ir a buscar las regiones: "+JSON.stringify(err) );
        });

      } else {        
        resultado(this.regiones);        
      }

    });
  }

}
