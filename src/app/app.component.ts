import { Component } from "@angular/core";
import { initializeApp } from "firebase/app";
import { indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { environment } from "src/environments/environment";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor() {
    const app = initializeApp(environment.firebase);
    if (Capacitor.isNativePlatform) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    }
  }
}
