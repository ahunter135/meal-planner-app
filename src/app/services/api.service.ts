import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base = 'https://banano-faucett.herokuapp.com/';
  //base = 'http://localhost:5000/';
  userProfile = {} as any;
  constructor(private http: HttpClient) {
    const profile = window.localStorage.getItem('userProfilePlanner');
    if (profile) {
      this.userProfile = JSON.parse(profile);
    } else {
      window.localStorage.setItem('loggedInPlanner', null);
    }
  }

  async login(email, password) {
    return await this.http.post(this.base + 'loginToMeal', {
      email,
      password
    },
    {
      observe: 'response',
      responseType: 'text'
    }
    ).toPromise();
  }

  async getRefreshedData() {
    const response = await this.http.get(this.base + 'refreshUserData', {
      params: {email: this.userProfile.email}
    }).toPromise();

    this.userProfile = response;
  }

  async updateUserProfile() {
    this.http.post(this.base + 'updateUserProfile', {
      profile: this.userProfile
    },
    {
      observe: 'response',
      responseType: 'text'
    }
    ).toPromise();
  }

  async deleteItem(item) {
    return await this.http.post(this.base + 'deleteItem', {
      email: this.userProfile.email,
      item: item.id
    },
    {
      observe: 'response',
      responseType: 'text'
    }
    ).toPromise();
  }

  async deleteWeeklyItem(item) {
    return await this.http.post(this.base + 'deleteWeeklyItem', {
      email: this.userProfile.email,
      item: item.id
    },
    {
      observe: 'response',
      responseType: 'text'
    }
    ).toPromise();
  }
}
