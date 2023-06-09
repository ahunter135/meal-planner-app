import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  item = {
    description: ""
  };
  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    const index = this.route.snapshot.params.index;
    this.item = this.api.userProfile.recipes[index];
    console.log(this.item);
  }

}
