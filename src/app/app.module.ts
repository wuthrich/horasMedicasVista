import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DatosmedicoComponent } from './datosmedico/datosmedico.component';
import { HacerhorarioComponent } from './hacerhorario/hacerhorario.component';
import { DatospacienteComponent } from './datospaciente/datospaciente.component';
import { EleccionmedicoComponent } from './eleccionmedico/eleccionmedico.component';
import { TomarhoraComponent } from './tomarhora/tomarhora.component';

const routes: Routes = [
  { path: 'tomarhora', component: TomarhoraComponent },
  { path: 'eleccionmedico', component: EleccionmedicoComponent },
  { path: 'paciente', component: DatospacienteComponent },
  { path: 'medico', component: DatosmedicoComponent },
  { path: 'hacerhorario', component: HacerhorarioComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DatosmedicoComponent,
    HacerhorarioComponent,
    DatospacienteComponent,
    EleccionmedicoComponent,
    TomarhoraComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
 
 }
