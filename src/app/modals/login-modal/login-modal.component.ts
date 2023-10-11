import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-login-modal",
  templateUrl: "./login-modal.component.html",
  styleUrls: ["./login-modal.component.scss"],
})
export class LoginModalComponent implements OnInit {
  email;
  password;
  constructor(private api: ApiService, private modalCtrl: ModalController) {}

  ngOnInit() {}

  async login() {
    try {
      const response = (await this.api.login(this.email, this.password)) as any;
      console.log(response);
      if (response.user) {
        this.modalCtrl.dismiss();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async create() {
    function generateRandomString(length = 7) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      return result;
    }
    const user = await createUserWithEmailAndPassword(
      getAuth(),
      this.email,
      this.password
    );
    if (user.user) {
      await setDoc(doc(getFirestore(), "users", user.user.uid), {
        email: this.email,
        shareCode: generateRandomString(),
      });
      this.modalCtrl.dismiss();
    }
  }
}
