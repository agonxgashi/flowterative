import { AppUser } from './../../models/auth/appUser.model';
// THIS IS JUST A TEST COMPONENT
import { JwtManager } from './../../services/auth/jwt-manager.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public val: AppUser;

  constructor(private jwt: JwtManager) { }

  ngOnInit() {

  }

  setV() {
    // tslint:disable-next-line:max-line-length
    this.jwt.setJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiVXNlcm5hbWUiOiJhZ29ueGdhc2hpIiwiX2lkIjoiMTIzNDU1IiwiaWF0IjoxNTE2MjM5MDIyfQ.-s-hMmUqCa730HWKVwdaOGWev9Lx7dCB9EFTWfz5HdU');
  }

  removeV() {
    this.jwt.clearJwt();
  }

}
