import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { DbService } from './services/db.service';
import { TabsPageModule } from './tabs/tabs.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [

    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),  // Add this
        AngularFirestoreModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        TabsPageModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        DbService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
