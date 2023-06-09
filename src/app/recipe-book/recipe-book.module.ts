import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeBookPageRoutingModule } from './recipe-book-routing.module';

import { RecipeBookPage } from './recipe-book.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeBookPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RecipeBookPage]
})
export class RecipeBookPageModule {}
