import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  Gesture,
  GestureController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import * as dayjs from "dayjs";
import { AddComponent } from "../modals/add/add.component";
import { LoginModalComponent } from "../modals/login-modal/login-modal.component";
import { ApiService } from "../services/api.service";
import { v4 as uuidv4 } from "uuid";
import { WeeklyComponent } from "../modals/weekly/weekly.component";
import { DateComponent } from "../modals/date/date.component";
import { ActivatedRoute, Router } from "@angular/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  @ViewChild("slidingList") slidingList;

  currentDate = dayjs();
  startDate;
  endDate;
  entries = [];
  startSwipeLocation;
  endSwipeLocation;
  changesInterval;
  loginObserver;
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    public api: ApiService,
    private loading: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private gestureCtrl: GestureController,
    private ref: ChangeDetectorRef,
    private router: Router,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {
    this.startDate = this.currentDate.startOf("week").format("MMM DD");
    this.endDate = this.currentDate.endOf("week").format("MMM DD");
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {}

  async itemHasBeenChecked(item) {
    const entries = this.api.userProfile.entries;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].id === item.id) {
        this.api.userProfile.entries[i] = item;
        break;
      }
    }

    this.getData();
    //Update userprofile on server
    this.api.updateItem(item);
  }

  ionViewWillLeave() {
    this.loginObserver();
    clearInterval(this.changesInterval);
  }

  ionViewDidEnter() {
    this.loginObserver = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const premium = await this.api.isUserPremium();

        if (premium) {
          this.route.queryParams.subscribe((params) => {
            if (!params.switch) {
              this.api.viewedUser = getAuth().currentUser.uid;
            } else {
              this.api.viewedUser = params.switch;
            }

            this.api.user = getAuth().currentUser.uid;
            this.getRefreshedData(null);
          });
        } else {
          // this.router.navigate(["upgrade"], {
          //   replaceUrl: true,
          // });
        }
      } else {
        console.log("HERE");
        this.showLogin();
      }
    });
    console.log("HERE");
    this.changesInterval = setInterval(() => {
      this.ref.detectChanges();
    }, 100);
    const gesture = this.gestureCtrl.create({
      el: document.getElementById("main"),
      onEnd: (detail) => {
        if (detail.currentX < detail.startX) {
          this.addWeek();
        } else if (detail.currentX > detail.startX) {
          this.subtractWeek();
        }
      },
      gestureName: "swipe",
    });

    gesture.enable(false);
  }

  async edit(item) {
    const modal = await this.modalCtrl.create({
      component: AddComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        currentDate: this.currentDate,
        item,
      },
    });
    await this.slidingList.closeSlidingItems();
    await modal.present();
    modal.onWillDismiss().then(async (data) => {
      // Add Modal dismissed, do logic
      if (data.data) {
        const loading = await this.loading.create({
          cssClass: "my-custom-class",
          message: "Please wait...",
        });
        await loading.present();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.api.userProfile.entries.length; i++) {
          if (this.api.userProfile.entries[i].id === item.id) {
            this.api.userProfile.entries[i].description = data.data.description;
            break;
          }
        }

        this.getData();
        //Update userprofile on server
        this.api.updateItem(item);
        loading.dismiss();
      }
    });
  }

  async showLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginModalComponent,
      swipeToClose: false,
      backdropDismiss: false,
    });

    await modal.present();
    modal.onWillDismiss().then(async (data) => {
      const premium = await this.api.isUserPremium();

      if (premium) {
        this.getData();
      } else {
        // this.router.navigate(["upgrade"], {
        //   replaceUrl: true,
        // });
      }
    });
  }

  async getRefreshedData(event) {
    const loading = await this.loading.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
    });
    await loading.present();
    await this.api.getRefreshedData();
    this.getData();
    loading.dismiss();
    if (event) {
      event.target.complete();
    }
  }

  async showOptions(item) {
    const sheet = await this.actionSheetCtrl.create({
      header: "Options",
      buttons: [
        {
          text: "Move to Next Week",
          handler: () => {
            const momentDate = dayjs(item.week);
            item.week = momentDate.add(1, "week").toISOString();
            const entries = this.api.userProfile.entries;
            for (let i = 0; i < entries.length; i++) {
              if (entries[i].id === item.id) {
                this.api.userProfile.entries[i] = item;
                break;
              }
            }

            this.getData();
            //Update userprofile on server
            this.api.updateItem(item);

            return;
          },
        },
        {
          text: "Move to Previous Week",
          handler: () => {
            const momentDate = dayjs(item.week);
            item.week = momentDate.subtract(1, "week").toISOString();
            const entries = this.api.userProfile.entries;
            for (let i = 0; i < entries.length; i++) {
              if (entries[i].id === item.id) {
                this.api.userProfile.entries[i] = item;
                break;
              }
            }

            this.getData();
            //Update userprofile on server
            this.api.updateItem(item);
            return;
          },
        },
        {
          text: "Save to Recipe Book",
          handler: async () => {
            let recipes = await this.api.getRecipes();
            let found = false;
            for (const i of recipes) {
              if (i.id === item.id) {
                found = true;
              }
            }

            if (!found) {
              this.api.saveRecipe(item);
            } else {
              alert("This is already in your recipe book");
              return true;
            }

            this.router.navigateByUrl("/tabs/tab1/recipe-book");
          },
        },
      ],
    });

    await sheet.present();
  }

  subtractWeek() {
    this.currentDate = this.currentDate.subtract(1, "week");
    this.startDate = this.currentDate.startOf("week").format("MMM DD");
    this.endDate = this.currentDate.endOf("week").format("MMM DD");

    this.getData();
  }

  addWeek() {
    this.currentDate = this.currentDate.add(1, "week");
    this.startDate = this.currentDate.startOf("week").format("MMM DD");
    this.endDate = this.currentDate.endOf("week").format("MMM DD");

    this.getData();
  }

  getData() {
    this.entries = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.api.userProfile.entries.length; i++) {
      const start = dayjs(this.api.userProfile.entries[i].week).startOf("week");
      const now = dayjs(this.currentDate).startOf("week");
      if (
        start.isSame(now, "day") &&
        this.api.userProfile.entries[i].deleted !== true
      ) {
        this.entries.push(this.api.userProfile.entries[i]);
      }
    }
  }

  async openDatePicker() {
    const modal = await this.modalCtrl.create({
      component: DateComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
    modal.onWillDismiss().then((data) => {
      this.currentDate = dayjs(data.data);
      this.startDate = this.currentDate.startOf("week").format("MMM DD");
      this.endDate = this.currentDate.endOf("week").format("MMM DD");

      this.getData();
    });
  }

  async doReorder(ev) {
    this.entries = this.array_move(this.entries, ev.detail.from, ev.detail.to);
    this.api.userProfile.entries = this.entries;
    await this.api.updateUserProfile();
    ev.detail.complete();
  }

  async showWeekly() {
    const modal = await this.modalCtrl.create({
      component: WeeklyComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();
    modal.onWillDismiss().then((data) => {});
  }

  setToToday() {
    this.currentDate = dayjs();
    this.startDate = this.currentDate.startOf("week").format("MMM DD");
    this.endDate = this.currentDate.endOf("week").format("MMM DD");

    this.getData();
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

  async showAdd() {
    const modal = await this.modalCtrl.create({
      component: AddComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        currentDate: this.currentDate,
      },
    });

    await modal.present();
    modal.onWillDismiss().then(async (data) => {
      // Add Modal dismissed, do logic
      if (data.data) {
        const loading = await this.loading.create({
          cssClass: "my-custom-class",
          message: "Please wait...",
        });
        await loading.present();
        const newItem = {
          week: this.currentDate.startOf("week").toISOString(),
          description: data.data.description,
          // mealTime: data.data.mealTime,
          id: uuidv4(),
        };
        this.api.userProfile.entries.push(newItem);

        this.getData();
        //Update userprofile on server
        this.api.addItem(newItem);
        loading.dismiss();
      }
    });
  }

  async delete(item) {
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
            await this.api.deleteItem(item);
            await this.getRefreshedData(null);
            this.getData();
          },
        },
      ],
    });

    alertPop.present();
  }
}
