import { Component, OnInit, Pipe } from '@angular/core';
import { SafePipe } from '../../pipes/safe.pipe';
import { BlogPost } from '../../models/blog/blog-post';
import { HttpClient, HttpRequest } from 'selenium-webdriver/http';
import { Http } from '@angular/http';

// import { Pipe } from '@angular/common'
// import {DomSanitizationService} from '@angular/platform-browser/esm/src/security/dom_sanitization_service';
// tslint:disable-next-line:use-pipe-transform-interface



@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {
  blog_post: BlogPost = new BlogPost();
  editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'direction': 'rtl' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': ['rgb(  0, 103, 244)',
                   'rgb( 90,  97, 105)',
                   'rgb( 23, 198, 133)',
                   'rgb(  0, 184, 216)',
                   'rgb(255, 180,   0)',
                   'rgb(196,  24,  60)',
                   'rgb( 33,  37,  41)']
                  }],
      [{ 'align': [] }]
    ]
  };

  constructor(private http: Http)  { }

  ngOnInit() {
  }


  post() {
    this.http.post('/api/blog', this.blog_post)
        .subscribe(
          (res) => { console.log(res); }
        );
  }
}
