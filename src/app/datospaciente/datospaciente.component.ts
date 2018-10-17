import { Component, OnInit } from '@angular/core';
//import { Opcionselect } from './../opcionselect';
import { Persona } from './../persona';
import { FachadaService } from './../fachada.service';
import { Router } from '@angular/router';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Component({
  selector: 'app-datospaciente',
  templateUrl: './datospaciente.component.html',
  styleUrls: ['./datospaciente.component.css']
})
export class DatospacienteComponent implements OnInit {

  private persona: Persona;
 
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
          //this.seleccionarOpcionesComunaCentro();
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

    this.fachada.personaPersiste(this.persona);
    this.router.navigate(['/eleccionmedico']);
  }

  volverId() {
    this.inicializarPersona();
    this.habilitarDesavilitarDiv0(false);
    this.soloEsconder();  

  }

  inicializarPersona() {
    this.persona = new Persona();

    this.persona.tipo = "1";
  }


  ngOnInit() {
    this.inicializarPersona();
  }

}
