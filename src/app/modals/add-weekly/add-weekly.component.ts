import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-weekly',
  templateUrl: './add-weekly.component.html',
  styleUrls: ['./add-weekly.component.scss'],
})
export class AddWeeklyComponent implements OnInit {
  mealDescription;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  addEntry(description) {
    if (description) {
      this.modalCtrl.dismiss({
        description
      });
    }
  }

}
