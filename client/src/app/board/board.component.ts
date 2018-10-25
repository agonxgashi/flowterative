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
import { AppUser } from '../../models/auth/appUser.model';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import * as tippy from 'tippy.js/dist/tippy.all.min.js';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('100ms', [
          animate('.5s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true}),
          
        query(':leave', stagger('50ms', [
          animate('.1s ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
})
export class BoardComponent implements OnInit, AfterViewInit {
  isLoadingBoard = true;
  boardId: string;
  board: BoardModel;
  listToCreate: ListModel = new ListModel();
  makeScrollable: boolean;
  allTasks: TaskModel[] = [];
  selectedTask: TaskModel = new TaskModel();
  taskToAdd: TaskModel = new TaskModel();
  subtaskToAdd: StepModel = new StepModel();
  stepToAdd: StepModel = new StepModel();
  memberToAdd: string;
  commentToAdd: CommentModel = new CommentModel();
  filterMyTasksOnly: Boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    private http: HttpClient,
    private token: JwtManager) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.boardId = params['id'];
      this.getBoardDetails();
    });
    this.makeScrollable = false;
    this.filterMyTasksOnly = this.getFilterValue();
  }

  ngAfterViewInit(): void {
    this.dragulaService.drag.subscribe((value) => {
    });
    this.dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
 }

  initTooltips() {
    tippy('.fa-question-circle', { animation: 'dynamic' });
  }

  // Getters
  public get board_lists(): ListModel[] {
    return this.board.Lists;
  }

  filterTasksOfList(list: ListModel): TaskModel[] {
    if (this.filterMyTasksOnly) {
      return list.Tasks.filter(x => x.Members.indexOf(this.token.getUser()._id) !== -1 );
    } else {
      return list.Tasks;
    }
  }

  getFilterValue(): Boolean {
    return JSON.parse(localStorage.getItem('FT-FILTER-MY-TASKS') || 'false');
  }

  setFilterValue() {
    localStorage.setItem('FT-FILTER-MY-TASKS', JSON.stringify(this.filterMyTasksOnly));
  }

  getBoardDetails() {
    this.isLoadingBoard = true;
    this.http.get<ReturnObject>(`/api/boards/find/${this.boardId}`)
      .subscribe(
        (res) => { this.board = res.data; this.isLoadingBoard = false; },
        (err) => { }
      );
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
      BoardId: this.boardId
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
        (res) => { },
        (err) => {
          alert('Error');
        }
      );
  }

  getTaskDetails(taskId: string) {
    this.selectedTask = undefined;
    this.http.get<ReturnObject>('/api/task/details/' + taskId)
      .subscribe(
        (res) => { this.selectedTask = res.data;}
      );
  }

  addNewTask() {
    this.taskToAdd.ProjectId = this.boardId;
    this.taskToAdd.ListId = this.board.Backlog._id;  // Id of default list which is backlog
    this.http.post<ReturnObject>('/api/task/add-new', this.taskToAdd)
      .subscribe(
        (res) => {
          if (res.success) {
            this.taskToAdd = new TaskModel();
            this.board.Backlog.Tasks.push(res.data);
          }
         },
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
        (res) => {
          if (res.success === true) {
            this.commentToAdd.CreatedBy = new AppUser();
            this.commentToAdd.CreatedBy.Username = this.token.getUser().Username;
            this.selectedTask.Comments.push(this.commentToAdd);
            this.commentToAdd = new CommentModel();
          } }
      );
  }

  addStep() {
    this.http.post<ReturnObject>('/api/task/add-step/' + this.selectedTask._id, this.stepToAdd)
        .subscribe(
          (res) => {
            if (res.success) {
              this.selectedTask.Steps = res.data;
              this.stepToAdd = new StepModel();
            }
          }
        );
  }

}
