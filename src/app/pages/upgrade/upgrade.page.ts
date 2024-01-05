import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
@Component({
  selector: "app-upgrade",
  templateUrl: "./upgrade.page.html",
  styleUrls: ["./upgrade.page.scss"],
})
export class UpgradePage implements OnInit {
  premium_id: string = "premium_monthly";
  loader;
  //products: IAPProduct[] = [];

  constructor(
    private platform: Platform,
    private ref: ChangeDetectorRef,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      // this.store.verbosity = this.store.DEBUG;
      this.registerProducts();
      this.setupListeners();

      // Get the real product information
      // this.store.ready(() => {
      //   console.log(this.store.products);
      //   this.products = this.store.products;
      // });
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
    //       if (this.loader) {
    //         this.loader.dismiss();
    //       }
    //       this.api.setIsPro(p.owned);
    //       this.router.navigate([""], {
    //         replaceUrl: true,
    //       });
    //     }
    //     this.ref.detectChanges();
    //     return p.verify();
    //   })
    //   .verified((p: IAPProduct) => p.finish())
    //   .cancelled(() => {
    //     if (this.loader) {
    //       this.loader.dismiss();
    //     }
    //   })
    //   .error(() => {
    //     if (this.loader) {
    //       this.loader.dismiss();
    //     }
    //   });
    // // Specific query for one ID
    // this.store.when(this.premium_id).owned((p: IAPProduct) => {
    //   this.api.setIsPro(p.owned);
    //   this.router.navigate([""], {
    //     replaceUrl: true,
    //   });
    //   if (this.loader) {
    //     this.loader.dismiss();
    //   }
    // });
  }

  async purchase(product: any) {
    //IAPProduct) {
    // console.log(product);
    // this.loader = await this.loadingCtrl.create({
    //   message: "Loading...",
    //   duration: 8500,
    // });
    // await this.loader.present();
    // this.store.order(product).then(
    //   (p) => {
    //     // Purchase in progress!
    //   },
    //   (e) => {
    //     this.loader.dismiss();
    //     this.presentAlert("Failed", `Failed to purchase: ${e}`);
    //   }
    // );
  }

  restore() {
    //this.store.refresh();
  }

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
