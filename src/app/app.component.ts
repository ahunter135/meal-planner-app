import { Component } from "@angular/core";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { environment } from "src/environments/environment";
import { Capacitor } from "@capacitor/core";
import { InAppPurchase2 } from "@ionic-native/in-app-purchase-2/ngx";
import { Platform } from "@ionic/angular";
import { IAPProduct } from "@ionic-native/in-app-purchase-2";
import { ApiService } from "./services/api.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  premium_id: string = "premium_monthly";
  constructor(
    private store: InAppPurchase2,
    private platform: Platform,
    public api: ApiService
  ) {
    const app = initializeApp(environment.firebase);
    if (Capacitor.isNativePlatform) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    }

    this.platform.ready().then(() => {
      onAuthStateChanged(getAuth(), (user) => {
        console.log(user);
        if (user) {
          this.api.viewedUser = user.uid;
        }
      });
      this.store.verbosity = this.store.DEBUG;
      this.registerProducts();
      this.setupListeners();

      // Get the real product information
      this.store.ready(() => {});
    });
  }

  registerProducts() {
    this.store.register({
      id: this.premium_id,
      type: this.store.PAID_SUBSCRIPTION,
    });

    this.store.refresh();
  }

  setupListeners() {
    this.store
      .when("product")
      .approved((p: IAPProduct) => {
        // Handle the product deliverable
        if (p.id === this.premium_id) {
          this.api.setIsPro(p.owned);
        }

        return p.verify();
      })
      .verified((p: IAPProduct) => p.finish())
      .cancelled(() => {})
      .error(() => {});

    // Specific query for one ID
    this.store.when(this.premium_id).owned((p: IAPProduct) => {
      this.api.setIsPro(p.owned);
    });
  }
}
