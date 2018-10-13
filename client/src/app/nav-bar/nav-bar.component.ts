import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { JwtManager } from '../../services/auth/jwt-manager.service';
import { AppUser } from '../../models/auth/appUser.model';
import { Router } from '@angular/router';
import { LoadingManager } from '../../services/UI/loading.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public usr: AppUser;
  public isLoading: boolean;

  constructor(private jwt: JwtManager,
              private translate: LanguageService,
              private router: Router,
              private loadingManager: LoadingManager) { }

  ngOnInit() {
    this.jwt.user$.subscribe(latestCollection => {
      this.usr = latestCollection;
    });

    this.jwt.load();

    this.loadingManager.isLoading$.subscribe(latestCollection => {
      this.isLoading = latestCollection;
    });

    this.loadingManager.load();
  }

  useLanguage(language: string) {
    this.translate.useLanguage(language);
  }

  logOut() {
    this.jwt.clearJwt();
    this.router.navigateByUrl('/');
  }

  navigateToHomepage() {
    // alert('Going home!');
  }
}
