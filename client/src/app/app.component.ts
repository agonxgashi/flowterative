import { Component } from '@angular/core';
import { LanguageService } from '../services/language/lang.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: LanguageService) {
    translate.setDefaultLanguage();
}


  title = 'app';
  useLanguage(language: string) {
    this.translate.useLanguage(language);
  }
}
