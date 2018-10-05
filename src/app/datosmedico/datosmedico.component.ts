import { Component, OnInit } from '@angular/core';
import { Persona } from './../persona';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Component({
  selector: 'app-datosmedico',
  templateUrl: './datosmedico.component.html',
  styleUrls: ['./datosmedico.component.css']
})
export class DatosmedicoComponent implements OnInit {

  private persona: Persona = new Persona();

  constructor() { }

  mostrarOesconderDiv() {
    var x = document.getElementById("div1");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  soloMostrar() {
    var x = document.getElementById("div1");
    x.style.display = "block";
  }

  soloEsconder() {
    var x = document.getElementById("div1");
    x.style.display = "none";
  }

  habilitarDesavilitarDiv0(disabled:boolean){

    var id = document.getElementById("id") as HTMLInputElement;
    id.disabled = disabled;
    var tipo = document.getElementById("tipo") as HTMLSelectElement;
    tipo.disabled = disabled;
    var seguirId = document.getElementById("seguirId") as HTMLButtonElement;
    seguirId.disabled = disabled;

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

    //console.log("this.datosPersonales.rut: "+this.datosPersonales.rut);

    //this.fire.personaLoad(this.persona);
    //this.router.navigate(['/datospersona']);

   this.habilitarDesavilitarDiv0(true);

    this.soloMostrar();

  }

  volverId(){
    this.persona.id="";
    this.habilitarDesavilitarDiv0(false);
    this.soloEsconder();
  }

  ngOnInit() {

  }

}
