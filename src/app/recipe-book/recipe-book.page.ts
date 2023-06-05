import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.page.html',
  styleUrls: ['./recipe-book.page.scss'],
})
export class RecipeBookPage implements OnInit {
  recipes = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    if (this.api.userProfile.recipes) {
      this.recipes = this.api.userProfile.recipes;
    }
  }

  delete(index) {
    this.recipes.splice(index, 1);
    this.api.userProfile.recipes = this.recipes;
    this.api.updateUserProfile();
  }
}
