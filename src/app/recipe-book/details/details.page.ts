import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
})
export class DetailsPage implements OnInit {
  item = {
    description: "",
  };
  idEdit: boolean = false;
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const index = this.route.snapshot.params.index;
    let recipes = await this.api.getRecipes();
    this.item = recipes[index];
    console.log(this.item);
  }
}
