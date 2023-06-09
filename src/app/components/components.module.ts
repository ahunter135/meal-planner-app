import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeCardSmallComponent } from 'src/app/components/recipe-card-small/recipe-card-small.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [RecipeCardSmallComponent],
  declarations: [RecipeCardSmallComponent]
})
export class ComponentsModule {}
