import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { Platform } from "@ionic/angular";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  base = "https://banano-faucett.herokuapp.com/";
  //base = 'http://localhost:5000/';
  userProfile = {} as any;
  viewedUser: string;
  user: string;
  isPremium: boolean = false;

  constructor(private http: HttpClient, private platform: Platform) {}

  async login(email, password) {
    return signInWithEmailAndPassword(getAuth(), email, password);
  }

  async getRefreshedData() {
    // get firebase data
    let user = getAuth().currentUser;

    let entries = await getDocs(
      collection(getFirestore(), "users", this.viewedUser, "entries")
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
    let ref = collection(getFirestore(), "users", this.viewedUser, "entries");

    const itemDoc = await getDocs(query(ref, where("id", "==", item.id)));
    return itemDoc.docs[0].id;
  }

  async updateItem(item: any) {
    let entry = await this.findItemDocId(item);
    updateDoc(
      doc(getFirestore(), "users", this.viewedUser, "entries", entry),
      item
    );
  }

  async addItem(item: any) {
    addDoc(
      collection(getFirestore(), "users", this.viewedUser, "entries"),
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
      doc(getFirestore(), "users", this.viewedUser, "entries", entry),
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

  /**
   * Steps
   * 1. Find the user with the typed code
   * 2. Once found, put this user into their user doc as "sharedPlanWith: []"
   * 3. Put the found user into this user's doc as "joinedPlans: []"
   * 4. Rewrite things to not be focused on the currently logged in user, but as the "viewing" users uid.
   * 5. Add a spot in settings to swap the currently viewed plan.
   * 6. As a user who is sharing, be able to set read/write permissions.
   */
  async joinPlan(shareCode: string) {
    // 1. Find User
    let ref = collection(getFirestore(), "users");

    const itemDoc = await getDocs(
      query(ref, where("shareCode", "==", shareCode))
    );

    if (itemDoc.docs.length == 1) {
      const user = itemDoc.docs[0];
      const userDocId = itemDoc.docs[0].id;

      // 2. Update User
      const sharedPlanWith = user.data()["sharedPlanWith"] || [];
      if (sharedPlanWith.includes(getAuth().currentUser.uid)) {
        return false;
      }
      await updateDoc(doc(getFirestore(), "users", userDocId), {
        sharedPlanWith: [
          getAuth().currentUser.uid,
          ...(user.data()["sharedPlanWith"] || []),
        ],
      });

      // 3. Update current user
      const me = await getDoc(
        doc(getFirestore(), "users", getAuth().currentUser.uid)
      );

      const joinedPlans = me.data()["sharedPlanWith"] || [];
      await updateDoc(doc(getFirestore(), "users", getAuth().currentUser.uid), {
        joinedPlans: [userDocId, ...joinedPlans],
      });
      console.log(user.data());
    } else {
      return false;
    }
  }

  async stopSharingPlan(plan) {
    // 1. Find User
    const itemDoc = await getDoc(doc(getFirestore(), "users", plan));

    const user = itemDoc;

    // 2. Update User
    const joinedPlans = user.data()["joinedPlans"] || [];

    if (joinedPlans.includes(getAuth().currentUser.uid)) {
      for (let i = 0; i < joinedPlans.length; i++) {
        if (joinedPlans[i] == getAuth().currentUser.uid) {
          joinedPlans.splice(i, 1);
        }
      }
    }
    await updateDoc(doc(getFirestore(), "users", plan), {
      joinedPlans,
    });

    // 3. Update current user
    const me = await getDoc(
      doc(getFirestore(), "users", getAuth().currentUser.uid)
    );

    const sharedPlanWith = me.data()["sharedPlanWith"] || [];
    for (let i = 0; i < sharedPlanWith.length; i++) {
      if (sharedPlanWith[i] == plan) {
        sharedPlanWith.splice(i, 1);
      }
    }
    await updateDoc(doc(getFirestore(), "users", getAuth().currentUser.uid), {
      sharedPlanWith,
    });
    console.log(user.data());
  }

  async isUserPremium() {
    const userDoc = await getDoc(
      doc(getFirestore(), "users", getAuth().currentUser.uid)
    );

    return userDoc.data()["isPremium"] || false;
  }

  setIsPro(isPremium) {
    this.isPremium = isPremium;

    updateDoc(doc(getFirestore(), "users", getAuth().currentUser.uid), {
      isPremium,
    });
  }

  async getRecipes() {
    let recipes = await getDocs(
      collection(getFirestore(), "users", this.viewedUser, "recipes")
    );
    let data = [];
    recipes.forEach((entry) => {
      data.push(entry.data());
    });

    return data;
  }

  async saveRecipe(item) {
    addDoc(
      collection(getFirestore(), "users", this.viewedUser, "recipes"),
      item
    );
  }
}
