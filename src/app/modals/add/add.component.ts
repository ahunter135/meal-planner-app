import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  @Input() currentDate: any;
  @Input() item: any;
  startDate;
  endDate;
  mealDescription;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.item) {this.mealDescription = this.item.description;}
    this.startDate = dayjs(this.currentDate).startOf('week').format('MMM DD');
    this.endDate = dayjs(this.currentDate).endOf('week').format('MMM DD');
  }

  addEntry(description) {
    if (description) {
      this.modalCtrl.dismiss({
        description
      });
    }
  }

}
