import { Component } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
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
  typedCode;
  joinedPlans;
  myPlan;
  sharedPlanWith;
  constructor(
    public modalCtrl: ModalController,
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
    this.observer = onAuthStateChanged(getAuth(), async (user) => {
      console.log(user);

      if (user) {
        this.api.viewedUser = getAuth().currentUser.uid;
        let userDoc = await getDoc(doc(getFirestore(), "users", user.uid));
        this.myPlan = userDoc.id;
        this.shareCode = userDoc.data()["shareCode"];
        this.joinedPlans = userDoc.data()["joinedPlans"] || [];
        this.sharedPlanWith = userDoc.data()["sharedPlanWith"] || [];
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

  async joinPlan() {
    const lowerCode = this.typedCode.toLowerCase();
    console.log(lowerCode);
    await this.api.joinPlan(lowerCode);

    this.modalCtrl.dismiss();
  }

  async switchPlans(plan: string) {
    this.api.viewedUser = plan;
    await this.modalCtrl.dismiss();

    this.router.navigateByUrl("/tabs/tab1?switch=" + plan);
  }

  restorePurchase() {}

  async stopSharing(plan) {
    const alertPop = await this.alertCtrl.create({
      header: "Are you sure?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          role: "confirm",
          handler: async () => {
            await this.api.stopSharingPlan(plan);
          },
        },
      ],
    });

    alertPop.present();
  }
}
