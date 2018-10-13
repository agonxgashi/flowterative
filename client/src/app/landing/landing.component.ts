import { JwtManager } from './../../services/auth/jwt-manager.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppUser } from '../../models/auth/appUser.model';
import { Router } from '@angular/router';
import { ReturnObject } from './../../models/returnObj.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  register_response: ReturnObject;
  loginResponse: ReturnObject;
  userToLog: AppUser = new AppUser();
  userToRegister: AppUser = new AppUser();

  constructor(private router: Router, private http: HttpClient, private jwtManager: JwtManager) { }

  ngOnInit() {
    const usr = this.jwtManager.getUser();
    if (usr) {
      this.router.navigateByUrl('/boards');
    }
  }

  login() {
    if (this.userToLog.Username && this.userToLog.Password) {
      this.http.post<ReturnObject>('/api/auth/login', this.userToLog)
      .subscribe(
        (res) => {
          this.loginResponse = res;
          if (this.loginResponse.success === true) {
            this.jwtManager.setJwt(this.loginResponse.data);
            this.router.navigateByUrl('/boards');
          }
        }
      );
    } else {
      this.loginResponse = new ReturnObject();
      this.loginResponse.success = false;
      this.loginResponse.message = 'ERR_LOGIN_NOCREDS';
    }
  }

  register() {
    this.http.post<ReturnObject>('/api/auth/register', this.userToRegister)
      .subscribe(
        (res) => { console.log(res); this.register_response = res; },
        (err) => { console.error(err); }
      );
  }

}
