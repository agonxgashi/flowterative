import { ReturnObject } from './../../models/returnObj.model';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../../models/blog/blog-post';
import { SafePipe } from '../../pipes/safe.pipe';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogResponse: ReturnObject = new ReturnObject();

  public get blogposts_list(): BlogPost[] {
    return this.blogResponse.success === true ? this.blogResponse.data : [];
  }


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<ReturnObject>('/api/blog')
      .subscribe(
        (res) => { this.blogResponse = res; }
      );
  }

}
