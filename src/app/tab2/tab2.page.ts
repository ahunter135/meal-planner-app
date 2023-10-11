import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { LoginModalComponent } from "../modals/login-modal/login-modal.component";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { getDoc, doc, getFirestore } from "firebase/firestore";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  shareCode;
  observer;
  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    this.observer = onAuthStateChanged(getAuth(), async (user) => {
      console.log(user);

      if (user) {
        let userDoc = await getDoc(doc(getFirestore(), "users", user.uid));
        this.shareCode = userDoc.data()["shareCode"];
      }
    });
  }

  ionViewWillLeave() {
    this.observer();
  }

  async logOut() {
    this.observer();

    await signOut(getAuth());
    this.router.navigate([""]);
  }

  async showLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginModalComponent,
      swipeToClose: false,
      backdropDismiss: false,
    });

    await modal.present();
    modal.onWillDismiss().then((data) => {});
  }
}
