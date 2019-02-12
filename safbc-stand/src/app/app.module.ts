import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { AddressFormComponent } from './ui/address-form/address-form.component';
import { LoginComponent } from './ui/login/login.component';
import { PageNotFoundComponent } from './ui/page-not-found/page-not-found.component';
import { HeaderComponent } from './ui/header/header.component';
import { FooterComponent } from './ui/footer/footer.component';
// import * as JWT from 'did-jwt';
// import { Credentials } from 'uport-credentials';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddressFormComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    // Credentials
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
  ]
})
export class AppModule { }
