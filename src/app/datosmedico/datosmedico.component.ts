import { Component, OnInit } from '@angular/core';
import { Opcionselect } from './../opcionselect';
import { Persona } from './../persona';
import { FachadaService } from './../fachada.service';
import { Router } from '@angular/router';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Component({
  selector: 'app-datosmedico',
  templateUrl: './datosmedico.component.html',
  styleUrls: ['./datosmedico.component.css']
})
export class DatosmedicoComponent implements OnInit {

  public persona: Persona;
  public comunas: Opcionselect[];
  public centros: Opcionselect[];

  constructor(private fachada: FachadaService, private router: Router) { }

  soloMostrar() {
    var x = document.getElementById("div1");
    x.style.display = "block";
  }

  soloEsconder() {
    var x = document.getElementById("div1");
    x.style.display = "none";
  }

  habilitarDesavilitarDiv0(disabled: boolean) {

    var id = document.getElementById("id") as HTMLInputElement;
    id.disabled = disabled;
    var tipo = document.getElementById("tipo") as HTMLSelectElement;
    tipo.disabled = disabled;
    var seguirId = document.getElementById("seguirId") as HTMLButtonElement;
    seguirId.disabled = disabled;

  }

  seleccionarOpcionesComunaCentro(){
    //No se pueden ocupar estos metodos porque son asyncronos
    //this.cambioRegion();
    //this.cambioComuna();

    //Region seleccionada
      let regionint = Number.parseInt(this.persona.region);
      let selectComunas = document.getElementById("comunas") as HTMLSelectElement;
      let selectCentros = document.getElementById("centros") as HTMLSelectElement;
      this.borrarTodasOpcionesSelect(selectCentros);
      this.borrarTodasOpcionesSelect(selectComunas);

      //comuna seleccionada
      let selected = Number.parseInt(this.persona.comuna);
   
        this.llenarSelectSegunPadre(regionint, this.comunas, selectComunas);
        if(this.persona.comuna==""){
          this.persona.comuna = "0";//para dejar selected la opcion 0 : Elija opción, si es que no hay una elejida
        }      
           
        
        this.llenarSelectSegunPadre(selected, this.centros, selectCentros);
        if(this.persona.centro == ""){
          this.persona.centro = "0";//para dejar selected la opcion 0 : Elija opción
        }
     
  }

  seguirId() {

    if (this.persona.id == "") {
      alert("Debe ingresar un rut/pasaporte");
      return;
    }
    let partidoEnDos: string = this.persona.id;
    let tipoComoNumero: number = Number.parseInt(this.persona.tipo);
    //Verifica que traiga la raya el rut
    if (tipoComoNumero == 1 && partidoEnDos.split("-").length != 2) {
      alert("Debe ingresar un rutcon digito verificador ej: 14.855.511-2");
      return;
    }

    //console.log("partidoEnDos: "+partidoEnDos);
    var raya = new RegExp(escapeRegExp("-"), 'g');
    var punto = new RegExp(escapeRegExp("."), 'g');

    // Aplicar reemplazo
    partidoEnDos = partidoEnDos.replace(raya, '').replace(punto, '').toLowerCase();

    if (tipoComoNumero == 2) {
      partidoEnDos += "p";
    }

    this.persona.id = partidoEnDos;

    this.fachada.personaLoad(this.persona.id).toPromise().then(
      datos => {
        var datosjson = datos as any;
        console.log("persona load trae datos: " + JSON.stringify(datosjson));
        if (datosjson.traedatos) {
          delete datosjson.traedatos;
          this.persona = datosjson;
          this.seleccionarOpcionesComunaCentro();
          console.log("persona quedo: " + JSON.stringify(this.persona));
        }
      }
    ).catch(
      error => {
        console.log("Ocurrio un error al Cargar persona: " + JSON.stringify(error));
      }
    );

    this.habilitarDesavilitarDiv0(true);
    this.soloMostrar();

  }

  seguirPersistente(){

    let form1 = document.getElementById("form1") as HTMLFormElement;
    if (!form1.checkValidity()) {
      alert("Debe llenar todos los datos");
      return;
    }

    this.fachada.personaPersiste(this.persona, 'medico');
    this.router.navigate(['/hacerhorario']);
  }

  volverId() {
    this.inicializarPersona();
    this.habilitarDesavilitarDiv0(false);
    this.soloEsconder();

    //Limpiar combos comunas y centros
    let selectComunas = document.getElementById("comunas") as HTMLSelectElement;
    let selectCentros = document.getElementById("centros") as HTMLSelectElement;
    this.borrarTodasOpcionesSelect(selectCentros);
    this.borrarTodasOpcionesSelect(selectComunas);

  }

  probar() {

    this.fachada.getEspecialidades().then(
      data => {
        console.log("Las especialidades son una segunda vez (esto se deberia hacer desde otro componente): " + JSON.stringify(data));
      }
    );

  }

  inicializarPersona() {
    this.persona = new Persona();

    this.persona.tipo = "1";
    this.persona.especialidad = "0";
    this.persona.region = "0";

  }

  borrarTodasOpcionesSelect(select: HTMLSelectElement) {
    let optionsCom = select.options as HTMLOptionsCollection;
    let numeroOpciones = optionsCom.length as number;

    for (var i = 0; i < numeroOpciones; i++) {
      optionsCom.remove(i);
    }

  }

  llenarSelectSegunPadre(padre: number, opciones: Opcionselect[], select: HTMLSelectElement) {

    let option = document.createElement("OPTION") as HTMLOptionElement;
    option.value = "0";
    option.text = "Elija opción";
    option.disabled = true;
    select.add(option);
    //Despues de correr esta funcion se deberia setear el modelo para que selected esta opcion  

    for (let opcion of opciones) {
      if (padre == opcion.padre) {
        let option = document.createElement("OPTION") as HTMLOptionElement;
        option.value = "" + opcion.key;
        option.text = opcion.value;
        select.add(option);
      }

    }
  }

  cambioRegion() {
    //let selectRegiones = document.getElementById("regiones") as HTMLSelectElement;
    //let regionint = Number.parseInt(selectRegiones.value);
    let regionint = Number.parseInt(this.persona.region);
    let selectComunas = document.getElementById("comunas") as HTMLSelectElement;
    let selectCentros = document.getElementById("centros") as HTMLSelectElement;
    this.borrarTodasOpcionesSelect(selectCentros);
    this.borrarTodasOpcionesSelect(selectComunas);

    this.fachada.getComunas().then(comunasObj => {
      let comunas = comunasObj as Opcionselect[];
      this.llenarSelectSegunPadre(regionint, comunas, selectComunas);
      if(this.persona.comuna==""){
        this.persona.comuna = "0";//para dejar selected la opcion 0 : Elija opción, si es que no hay una elejida
      }
      
    });

  }

  cambioComuna() {
    //let selectComunas = document.getElementById("comunas") as HTMLSelectElement;
    //let selected = Number.parseInt(selectComunas.value);
    let selected = Number.parseInt(this.persona.comuna);
    let selectCentros = document.getElementById("centros") as HTMLSelectElement;
    this.borrarTodasOpcionesSelect(selectCentros);

    this.fachada.getCentros().then(centrosObj => {
      let centros = centrosObj as Opcionselect[];
      this.llenarSelectSegunPadre(selected, centros, selectCentros);
      if(this.persona.centro == ""){
        this.persona.centro = "0";//para dejar selected la opcion 0 : Elija opción
      }
      
    });

  }

  ngOnInit() {

    this.inicializarPersona();

    this.fachada.getEspecialidades().then(
      data => {
        console.log("Las especialidades son: " + JSON.stringify(data));
        let especialidades = data as Opcionselect[];

        let selectespecialidades = document.getElementById("especialidades") as HTMLSelectElement;
        for (let especialidad of especialidades) {
          let option = document.createElement("OPTION") as HTMLOptionElement;
          option.value = "" + especialidad.key;
          option.text = especialidad.value;
          selectespecialidades.add(option);
        }

      }
    );

    this.fachada.getRegiones().then(
      data => {
        let regiones = data as Opcionselect[];

        let selectRegiones = document.getElementById("regiones") as HTMLSelectElement;
        for (let region of regiones) {
          let option = document.createElement("OPTION") as HTMLOptionElement;
          option.value = "" + region.key;
          option.text = region.value;
          selectRegiones.add(option);
        }

      }
    );

    this.fachada.getCentros().then(centrosObj => {
      this.centros = centrosObj as Opcionselect[];      
    });

    this.fachada.getComunas().then(comunasObj => {
      this.comunas = comunasObj as Opcionselect[];      
    });


  }

}
