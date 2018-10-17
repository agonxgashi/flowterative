import { BoardModel } from './../../models/board/board.model';
import { ReturnObject } from './../../models/returnObj.model';
import { ListModel } from './../../models/board/list.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { HttpClient } from '@angular/common/http';
import { TaskModel } from '../../models/task/task.model';
import { StepModel } from '../../models/task/step.model';
import { CommentModel } from '../../models/task/comment.model';
import { JwtManager } from '../../services/auth/jwt-manager.service';

@Component({
  selector   : 'app-board',
  templateUrl: './board.component.html',
  styleUrls  : ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {
  isLoadingBoard = true;
  boardId       : string;
  board         : BoardModel;
  listToCreate  : ListModel = new ListModel();
  makeScrollable: boolean;
  allTasks      : TaskModel[] = [];
  selectedTask  : TaskModel = new TaskModel();
  taskToAdd     : TaskModel = new TaskModel();
  subtaskToAdd  : StepModel = new StepModel();
  memberToAdd   : string;
  commentToAdd  : CommentModel = new CommentModel();

  constructor(private activatedRoute: ActivatedRoute, private dragulaService: DragulaService, private http: HttpClient, private token: JwtManager) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.boardId = params['id'];
      this.getBoardDetails();
    });
    this.makeScrollable = false;
  }

  // Getters

  public get board_lists(): ListModel[] {
    return this.board.Lists.filter(x => x._id);
  }

  getBoardDetails() {
    this.isLoadingBoard = true;
    this.http.get<ReturnObject>(`/api/boards/find/${this.boardId}`)
        .subscribe(
          (res) => {this.board = res.data; this.isLoadingBoard = false; },
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
    this.moveTask(e.id, target.id);
    // console.log('Element [', e.id, '] was dropped on bag [', target.id, '] from bag [', origin.id, '] after element [', before.id, ']');
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // BOARD

  addMember() {
    const data = {
      Username: this.memberToAdd,
      BoardId : this.boardId
    };
    this.http.post('/api/boards/add-new-member', data)
        .subscribe(
          (res) => { }
        );
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // LISTS

  addList() {
    this.listToCreate.BoardId = this.boardId;
    this.http.post<ReturnObject>('/api/boards/add-list', this.listToCreate)
        .subscribe(
            (res) => { this.getBoardDetails(); }
        );
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // TASKS

  moveTask(taskId: string, listId: string) {
    this.http.get<ReturnObject>(`/api/task/move/${taskId}/${listId}`)
        .subscribe(
            (res) => {  },
            (err) => {
              alert('Error');
            }
        );
  }

  getTaskDetails(taskId: string) {
    this.http.get<ReturnObject>('/api/task/details/' + taskId)
        .subscribe(
            (res) => { this.selectedTask = res.data; }
        );
  }

  addNewTask() {
    this.taskToAdd.ProjectId = this.boardId;
    this.taskToAdd.ListId    = this.board.Backlog._id;  // Id of default list which is backlog
    this.http.post('/api/task/add-new', this.taskToAdd)
        .subscribe(
            (res) => { this.taskToAdd = new TaskModel(); },
            (err) => { }
        );
  }

  addSubtask() {
    this.taskToAdd.Steps.push(this.subtaskToAdd);
    this.subtaskToAdd = new StepModel();
  }

  removeSubtask(subtaskIndex: number) {
    if (subtaskIndex > -1) {
      this.taskToAdd.Steps.splice(subtaskIndex, 1);
    }
  }

  addNewComment() {
    this.commentToAdd.CreatedBy = this.token.getUser()._id;
    this.http.post<ReturnObject>('/api/task/comment/' + this.selectedTask._id, this.commentToAdd)
        .subscribe(
            (res) => { if (res.success === true) { this.selectedTask.Comments.push(this.commentToAdd); } }
        );
  }

}
