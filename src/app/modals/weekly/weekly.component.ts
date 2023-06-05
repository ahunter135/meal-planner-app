import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AddWeeklyComponent } from '../add-weekly/add-weekly.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
})
export class WeeklyComponent implements OnInit {
  entries = [];
  constructor(private modalCtrl: ModalController, private api: ApiService) { }

  ngOnInit() {
    this.entries = this.api.userProfile.mustHaves;
  }

  async addItem() {
    const modal = await this.modalCtrl.create({
      component: AddWeeklyComponent,
      swipeToClose: true,
      presentingElement: await this.modalCtrl.getTop(),
    });

    await modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data.data);
      if (data.data) {
        this.entries.push({ description: data.data.description, id: uuidv4() });
        this.api.userProfile.mustHaves = this.entries;
        this.api.updateUserProfile();
      }
    });
  }

  async delete(item) {
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i].id === item.id) {
        this.entries.splice(i, 1);
        break;
      }
    }
    await this.api.deleteWeeklyItem(item);
  }

}
