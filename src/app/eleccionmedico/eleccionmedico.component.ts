import { Component, OnInit } from '@angular/core';
import { Opcionselect } from './../opcionselect';
import { Persona } from './../persona';
import { FachadaService } from './../fachada.service';
import { Router } from '@angular/router';

declare var moment;

@Component({
  selector: 'app-eleccionmedico',
  templateUrl: './eleccionmedico.component.html',
  styleUrls: ['./eleccionmedico.component.css']
})
export class EleccionmedicoComponent implements OnInit {

  private regiones: Opcionselect[];
  private comunas: Opcionselect[];
  private centros: Opcionselect[];
  private especialidades: Opcionselect[];
  private especialistas: Persona[];
  private especialistaSeleccionado: Persona;

  constructor(private fachada: FachadaService, private router: Router) { }

  volver() {
    this.router.navigate(['/paciente']);
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
    option.text = "Todas";
    //option.disabled = true;
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

  opcionNombre(key:number, arreglo:Opcionselect[]){
    let nombre:string;

    for(let opcion of arreglo){
      if(opcion.key==key){
        nombre=opcion.value;
        break;
      }
    }

    return nombre;
  }

  sortEspecialistas(){

    console.log("ordena especialistas "+this.especialistas.length +" "+JSON.stringify(this.especialistaSeleccionado));
    console.log("especialistas "+JSON.stringify(this.especialistas));
    let selectespecialistas = document.getElementById("especialistas") as HTMLSelectElement;
    this.borrarTodasOpcionesSelect(selectespecialistas);
    this.especialistaSeleccionado.id = "";
    
    let option = document.createElement("OPTION") as HTMLOptionElement;
    //option.value = "0";
    option.text = "Elija opción";    
    selectespecialistas.add(option);

    for (let especialista of this.especialistas) {
      //console.log("especialista " + JSON.stringify(especialista));

      if(this.especialistaSeleccionado.comuna!="0" &&
      this.especialistaSeleccionado.comuna!=especialista.comuna){
        continue;
      }

      if(this.especialistaSeleccionado.centro!="0" &&
      this.especialistaSeleccionado.centro!=especialista.centro){
        continue;
      }

      if(this.especialistaSeleccionado.especialidad!="0" &&
      this.especialistaSeleccionado.especialidad!=especialista.especialidad){
        continue;
      }

      let option = document.createElement("OPTION") as HTMLOptionElement;
      option.value = especialista.id;
      option.text = this.opcionNombre(Number.parseInt(especialista.comuna), this.comunas) +"-"+
      this.opcionNombre(Number.parseInt(especialista.centro), this.centros) +"-"+ 
      this.opcionNombre(Number.parseInt(especialista.especialidad), this.especialidades)+". "+especialista.nombre;
      selectespecialistas.add(option);
    }

  }

  cambioRegion() {

    let selectComunas = document.getElementById("comunas") as HTMLSelectElement;
    let selectCentros = document.getElementById("centros") as HTMLSelectElement;
    this.borrarTodasOpcionesSelect(selectCentros);
    this.borrarTodasOpcionesSelect(selectComunas);

    this.llenarSelectSegunPadre(Number.parseInt(this.especialistaSeleccionado.region),
      this.comunas, selectComunas);

    this.especialistaSeleccionado.comuna = "0";//para dejar selected la opcion 0
    this.especialistaSeleccionado.centro = "0";//para dejar selected la opcion 0

    console.log("cambio region: "+JSON.stringify(this.especialistaSeleccionado));

    let anioActual = moment().isoWeekYear();
    let semanaActual = moment().isoWeek();
    this.fachada.especialistasConCalendario(this.especialistaSeleccionado.region, anioActual, semanaActual)
    .toPromise().then(personasObj => {      
      var jsonRespuesta = personasObj as any;
      if(jsonRespuesta.traedatos){
        this.especialistas = jsonRespuesta.personas;
      }else{
        this.especialistas = new Array();
      }      
      this.sortEspecialistas();     
    });

  }

  cambioComuna() {

    let selected = Number.parseInt(this.especialistaSeleccionado.comuna);
    let selectCentros = document.getElementById("centros") as HTMLSelectElement;
    this.borrarTodasOpcionesSelect(selectCentros);
    this.llenarSelectSegunPadre(selected, this.centros, selectCentros);
    this.especialistaSeleccionado.centro = "0";//para dejar selected la opcion 0 
    this.sortEspecialistas();
    //console.log("cambio comuna: "+JSON.stringify(this.especialistaSeleccionado));
   
  }

  cambioCentros(){
    //console.log("cambio centros: "+JSON.stringify(this.especialistaSeleccionado));
    this.sortEspecialistas();
  }

  cambioEspecialidades(){
    this.sortEspecialistas();
  }

  seguir(){
    console.log(JSON.stringify(this.especialistaSeleccionado));
    if(this.especialistaSeleccionado.id==""){
      alert("Debe escoger un especialista");
      return;
    }

    //this.fachada.paciente=this.fachada.persona;//cambio para que la persona siempre sea el medico
    for(let especialista of this.especialistas){
      if(especialista.id==this.especialistaSeleccionado.id){
        this.fachada.medico=especialista;
        break;
      }
    }

    console.log(JSON.stringify(this.fachada.medico));
    console.log(JSON.stringify(this.fachada.paciente));

    this.router.navigate(['/tomarhora']);
  }

  ngOnInit() {
    this.especialistaSeleccionado = new Persona();    

    this.fachada.getRegiones().then(
      data => {
        this.regiones = data as Opcionselect[];
        let selectRegiones = document.getElementById("regiones") as HTMLSelectElement;
        let option = document.createElement("OPTION") as HTMLOptionElement;
        option.value = "0";
        option.text = "Elija opción";
        option.disabled = true;
        selectRegiones.add(option);
        this.especialistaSeleccionado.region = "0";//Elegido por defecto

        for (let region of this.regiones) {
          let option = document.createElement("OPTION") as HTMLOptionElement;
          option.value = "" + region.key;
          option.text = region.value;
          selectRegiones.add(option);
        }

      }
    );

    this.fachada.getComunas().then(comunasObj => {
      this.comunas = comunasObj as Opcionselect[];
    });

    this.fachada.getCentros().then(centrosObj => {
      this.centros = centrosObj as Opcionselect[];
    });

    this.fachada.getEspecialidades().then(
      data => {        
        this.especialidades = data as Opcionselect[];
        let selectespecialidades = document.getElementById("especialidades") as HTMLSelectElement;
        let option = document.createElement("OPTION") as HTMLOptionElement;
        option.value = "0";
        option.text = "Todas";
        //option.disabled = true;
        selectespecialidades.add(option);
        this.especialistaSeleccionado.especialidad = "0";//Elegido por defecto

        for (let especialidad of this.especialidades) {
          let option = document.createElement("OPTION") as HTMLOptionElement;
          option.value = "" + especialidad.key;
          option.text = especialidad.value;
          selectespecialidades.add(option);
        }

      }
    );
  }

}
