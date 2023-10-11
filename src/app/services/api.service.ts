import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  base = "https://banano-faucett.herokuapp.com/";
  //base = 'http://localhost:5000/';
  userProfile = {} as any;
  constructor(private http: HttpClient) {}

  async login(email, password) {
    return signInWithEmailAndPassword(getAuth(), email, password);
  }

  async getRefreshedData() {
    // get firebase data
    let user = getAuth().currentUser;

    let entries = await getDocs(
      collection(getFirestore(), "users", user.uid, "entries")
    );
    let data = [];
    entries.forEach((entry) => {
      data.push(entry.data());
    });
    data.sort((a: any, b: any) => {
      const dateA = new Date(a.week);
      const dateB = new Date(b.week);

      return dateA.getTime() - dateB.getTime();
    });

    this.userProfile.entries = data;
  }

  async findItemDocId(item: any) {
    let ref = collection(
      getFirestore(),
      "users",
      getAuth().currentUser.uid,
      "entries"
    );

    const itemDoc = await getDocs(query(ref, where("id", "==", item.id)));
    return itemDoc.docs[0].id;
  }

  async updateItem(item: any) {
    let entry = await this.findItemDocId(item);
    updateDoc(
      doc(getFirestore(), "users", getAuth().currentUser.uid, "entries", entry),
      item
    );
  }

  async addItem(item: any) {
    addDoc(
      collection(getFirestore(), "users", getAuth().currentUser.uid, "entries"),
      item
    );
  }
  async updateUserProfile() {
    this.http
      .post(
        this.base + "updateUserProfile",
        {
          profile: this.userProfile,
        },
        {
          observe: "response",
          responseType: "text",
        }
      )
      .toPromise();
  }

  async deleteItem(item) {
    let entry = await this.findItemDocId(item);
    item.deleted = true;
    updateDoc(
      doc(getFirestore(), "users", getAuth().currentUser.uid, "entries", entry),
      item
    );
  }

  async deleteWeeklyItem(item) {
    return await this.http
      .post(
        this.base + "deleteWeeklyItem",
        {
          email: this.userProfile.email,
          item: item.id,
        },
        {
          observe: "response",
          responseType: "text",
        }
      )
      .toPromise();
  }
}
