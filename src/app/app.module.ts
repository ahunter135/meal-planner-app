import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // eslint-disable-next-line max-len
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({ mode: "ios" }),
    AppRoutingModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
