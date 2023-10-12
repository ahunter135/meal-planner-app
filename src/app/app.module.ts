import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { GetUserPipe } from "./pipes/get-user.pipe";
import { InAppPurchase2 } from "@ionic-native/in-app-purchase-2/ngx";
import { NgxSummernoteModule } from "ngx-summernote";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // eslint-disable-next-line max-len
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({ mode: "ios" }),
    AppRoutingModule,
    NgxSummernoteModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppPurchase2,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
