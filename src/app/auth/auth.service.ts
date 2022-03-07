import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, RouterModule, Routes } from "@angular/router";
import { AuthData } from "./auth.data.model";


@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    // user created with the auth.data.model
    const authData: AuthData = {
      email: email,
      password: password
    }
    // the model created is sent to backend 'post' hook
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      })
  }

  login(email: string, password: string) {
    // user created with the auth.data.model
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

}
