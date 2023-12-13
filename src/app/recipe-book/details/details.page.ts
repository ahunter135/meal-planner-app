import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { Camera, CameraResultType } from "@capacitor/camera";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
})
export class DetailsPage implements OnInit {
  item = {
    description: "",
    recipe: "",
    recipeImage: null,
  };
  isEdit: boolean = false;
  content: string;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    const index = this.route.snapshot.params.index;
    let recipes = await this.api.getRecipes();
    this.item = recipes[index];
    this.content = this.item.recipe;
    console.log(this.item);
  }

  setContent(ev) {
    this.content = ev.html;
  }

  saveContent() {
    this.item.recipe = this.content;

    this.api.updateItemRecipe(this.item);
    this.isEdit = !this.isEdit;
  }

  async attachPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      width: 500,
      height: 500,
    });

    this.item.recipeImage = await this.api.attachPhotoToRecipe(
      this.item,
      image.base64String
    );
    this.saveContent();
  }

  async delete() {
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
            await this.api.deleteItemRecipe(this.item);
            this.router.navigateByUrl("/tabs/tab1/recipe-book");
          },
        },
      ],
    });

    alertPop.present();
  }
}
