import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { setDoc, doc, getFirestore, getDoc } from "firebase/firestore";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-login-modal",
  templateUrl: "./login-modal.component.html",
  styleUrls: ["./login-modal.component.scss"],
})
export class LoginModalComponent implements OnInit {
  email;
  password;
  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async login() {
    try {
      const response = (await this.api.login(
        this.email,
        this.password
      )) as UserCredential;
      if (response.user) {
        const userDoc = await getDoc(
          doc(getFirestore(), "users", response.user.uid)
        );

        if (userDoc.exists && userDoc.data().deleted) {
          signOut(getAuth());
          const toast = await this.toastCtrl.create({
            message: "Account Disabled",
            duration: 3000,
          });
          toast.present();
        } else {
          this.modalCtrl.dismiss();
        }
      }
    } catch (error) {
      this.showToast(error);
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
      return result.toLowerCase();
    }
    try {
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
    } catch (error) {
      this.showToast(error);
    }
  }

  private translateFirebaseError(error: any): string {
    switch (error.code) {
      case "auth/invalid-email":
        return "The email address is not valid. Please check and try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "The email address is already in use by another account.";
      case "auth/weak-password":
        return "The password is too weak. Please use a stronger password.";
      case "auth/operation-not-allowed":
        return "Signing in with this method is not allowed. Please contact support.";
      case "auth/invalid-login-credentials":
        return "Incorrect credentials. Please try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  }

  async showToast(message: any) {
    const readableError = this.translateFirebaseError(message);

    const toast = await this.toastCtrl.create({
      message: readableError,
      duration: 3000,
      position: "bottom", // Change this if you prefer another position
    });
    toast.present();
  }
}
