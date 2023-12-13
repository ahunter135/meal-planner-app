import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DetailsPageRoutingModule } from "./details-routing.module";

import { DetailsPage } from "./details.page";
import { RecipeCardSmallComponent } from "src/app/components/recipe-card-small/recipe-card-small.component";
import { ComponentsModule } from "src/app/components/components.module";
import { QuillModule } from "ngx-quill";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    QuillModule,
  ],
  declarations: [DetailsPage],
})
export class DetailsPageModule {}
