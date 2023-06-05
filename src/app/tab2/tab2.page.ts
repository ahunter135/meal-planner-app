import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  shareCode;
  constructor(private modalCtrl: ModalController, private api: ApiService) {}

  ionViewWillEnter() {
    const loggedIn = window.localStorage.getItem('loggedInPlanner');

    if (!loggedIn || loggedIn === 'null') {
      this.showLogin();
    } else {
      const profile = window.localStorage.getItem('userProfilePlanner');
      if (profile) {
        this.api.userProfile = JSON.parse(profile);
      }
      console.log(this.api.userProfile);
      if (this.api.userProfile) {
        this.shareCode = this.api.userProfile.shareCode;
      }
    }
  }

  logOut() {
    window.localStorage.clear();
    this.showLogin();
  }

  async showLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginModalComponent,
      swipeToClose: false,
      backdropDismiss: false,
    });

    await modal.present();
    modal.onWillDismiss().then(data => {
      // Login Modal dismissed, do logic
      window.localStorage.setItem('userProfilePlanner', JSON.stringify(data.data));
      window.localStorage.setItem('loggedInPlanner', 'true');
      this.api.userProfile = data.data;
      this.ionViewWillEnter();
    });

  }
}
