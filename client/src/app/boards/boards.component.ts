import { JwtManager } from './../../services/auth/jwt-manager.service';
import { ReturnObject } from './../../models/returnObj.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BoardModel } from '../../models/board/board.model';
import { ResponseOptions } from '@angular/http';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {
  responseBoards: ReturnObject = new ReturnObject();
  boardToCreate: BoardModel = new BoardModel();
  search = '';

  public get boardList(): BoardModel[] {
    return this.responseBoards.success === true ?
      this.responseBoards.data.filter(b => b.Name.toUpperCase().includes(this.search.toUpperCase()))
        : [];
  }

  constructor(private http: HttpClient, private jwt: JwtManager) { }

  ngOnInit() {
    this.getBoards();
  }


  getBoards() {
    this.http.get<ReturnObject>('/api/boards')
        .subscribe(
            (res) => { this.responseBoards = res; console.log(this.responseBoards.data); }
        );
  }

  createBoard() {
    this.boardToCreate.CreatedBy = this.jwt.getUser();
    this.http.post<ReturnObject>('/api/boards', this.boardToCreate)
        .subscribe(
            (res) => { this.responseBoards = res; }
        );
  }
}
