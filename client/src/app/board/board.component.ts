import { BoardModel } from './../../models/board/board.model';
import { ReturnObject } from './../../models/returnObj.model';
import { ListModel } from './../../models/board/list.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { TaskModel } from '../../models/task/task.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {
  boardId: string;
  board: BoardModel;
  listToCreate: ListModel = new ListModel();
  makeScrollable: boolean;
  taskToAdd: TaskModel = new TaskModel();
  subtaskToAdd: string;

  constructor(private activatedRoute: ActivatedRoute, private dragulaService: DragulaService, private http: HttpClient) { 
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.boardId = params['id'];
      this.getBoardDetails();
    });
    this.makeScrollable = false;
  }

  getBoardDetails() {
    this.http.get<ReturnObject>(`/api/boards/find/${this.boardId}`)
        .subscribe(
          (res) => {this.board = res.data; console.log(this.board ); },
          (err) => { }
        );
  }

  ngAfterViewInit(): void {
    this.dragulaService.drag.subscribe((value) => {
    });
    this.dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });

  }

  private onDrop(args) {
    // e      -> Element that was dragged
    // target -> Bag on which element was droped
    // origin -> Bag on which element was before being dragged
    // before -> Element, before which 'e' was dropped
    const [e, target, origin, before] = args;
    // console.log('Element [', e.id, '] was dropped on bag [', target.id, '] from bag [', origin.id, '] after element [', before.id, ']');
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // LISTS

  addList() {
    this.listToCreate.BoardId = this.boardId;
    this.http.post<ReturnObject>('/api/boards/add-list', this.listToCreate)
        .subscribe(
            (res) => { console.log(res); }
        );
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // TASKS

  addSubtask() {
    this.taskToAdd.Steps.push(this.subtaskToAdd);
    this.subtaskToAdd = '';
  }

  removeSubtask(subtaskIndex: number) {
    if (subtaskIndex > -1) {
      this.taskToAdd.Steps.splice(subtaskIndex, 1);
    }
  }
}
