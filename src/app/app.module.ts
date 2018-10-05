import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DatosmedicoComponent } from './datosmedico/datosmedico.component';

const routes: Routes = [
  { path: 'medico', component: DatosmedicoComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DatosmedicoComponent
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
export class AppModule { }
