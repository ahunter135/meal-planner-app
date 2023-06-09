import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-card-small',
  templateUrl: './recipe-card-small.component.html',
  styleUrls: ['./recipe-card-small.component.scss'],
})
export class RecipeCardSmallComponent implements OnInit {
  @Input() title: string;
  constructor() { }

  ngOnInit() {}

}
