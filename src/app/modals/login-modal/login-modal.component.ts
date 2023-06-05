import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  email;
  password;
  constructor(private api: ApiService,
    private modalCtrl: ModalController) { }

  ngOnInit() {}

  async login() {
    try {
      const response = await this.api.login(this.email, this.password) as any;
      if (response.status === 200) {
        this.modalCtrl.dismiss(JSON.parse(response.body));
      }
    } catch (error) {
      alert(error.message);
    }
  }

  navToCreateAccount() {

  }
}
