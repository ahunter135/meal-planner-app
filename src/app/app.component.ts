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
import { ModalController, Platform } from "@ionic/angular";
import { ApiService } from "./services/api.service";
import { LoginModalComponent } from "./modals/login-modal/login-modal.component";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  premium_id: string = "premium_monthly";
  constructor(
    private platform: Platform,
    public api: ApiService,
    private modalCtrl: ModalController
  ) {
    const app = initializeApp(environment.firebase);
    if (Capacitor.isNativePlatform) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    }

    this.platform.ready().then(() => {
      onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          this.api.viewedUser = user.uid;
        } else {
          const modal = await this.modalCtrl.create({
            component: LoginModalComponent,
            swipeToClose: false,
            backdropDismiss: false,
          });

          await modal.present();
          modal.onWillDismiss().then(async (data) => {});
        }
      });
      // this.store.verbosity = this.store.DEBUG;
      // this.registerProducts();
      // this.setupListeners();

      // // Get the real product information
      // this.store.ready(() => {});
    });
  }

  registerProducts() {
    // this.store.register({
    //   id: this.premium_id,
    //   type: this.store.PAID_SUBSCRIPTION,
    // });
    // this.store.refresh();
  }

  setupListeners() {
    // this.store
    //   .when("product")
    //   .approved((p: IAPProduct) => {
    //     // Handle the product deliverable
    //     if (p.id === this.premium_id) {
    //       this.api.setIsPro(p.owned);
    //     }
    //     return p.verify();
    //   })
    //   .verified((p: IAPProduct) => p.finish())
    //   .cancelled(() => {})
    //   .error(() => {});
    // // Specific query for one ID
    // this.store.when(this.premium_id).owned((p: IAPProduct) => {
    //   this.api.setIsPro(p.owned);
    // });
  }

  ngOnInit() {
    console.log("Initializing HomePage");

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      window.localStorage.setItem("token", token.value);
      // alert("Push registration success, token: " + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {});

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {}
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {}
    );
  }
}
