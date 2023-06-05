import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  datePicker;
  constructor(
    private modalCtrl: ModalController) { }

  ngOnInit() {}

  changed(date) {
    this.modalCtrl.dismiss(date);
  }

}
