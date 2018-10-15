import { BoardModel } from './../../models/board/board.model';
import { ReturnObject } from './../../models/returnObj.model';
import { ListModel } from './../../models/board/list.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { HttpClient } from '@angular/common/http';
import { TaskModel } from '../../models/task/task.model';
import { StepModel } from '../../models/task/step.model';

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
  allTasks: TaskModel[] = [];
  taskToAdd: TaskModel = new TaskModel();
  subtaskToAdd: StepModel = new StepModel();

  constructor(private activatedRoute: ActivatedRoute, private dragulaService: DragulaService, private http: HttpClient) { 
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.boardId = params['id'];
      this.getBoardDetails();
      this.getAllTasks();
    });
    this.makeScrollable = false;
  }

  // Getters
  
  public get backlog_tasks() : TaskModel[] {
    return this.allTasks.filter(x => x.ListId == this.board.Backlog._id);
  }

  private getTasksOfList(listId: string): TaskModel[] {
    return this.allTasks.filter(x => x.ListId = listId);
  }
  
  public get lists_model(): ListModel[]{
    let temp: ListModel[] = [];

    if (this.board && this.board.Lists && this.allTasks) {
      this.board.Lists.forEach( (list:ListModel) => {
        this.allTasks.forEach((task: TaskModel) => {
            if (list._id == task.ListId ) {
              if (!list.Tasks) list.Tasks = [];
              list.Tasks.push(task);
            }
        });
        // list.Tasks = this.getTasksOfList(list._id);
        temp.push(list);
    });
    }
    
    return temp;
  }
  
  getBoardDetails() {
    this.http.get<ReturnObject>(`/api/boards/find/${this.boardId}`)
        .subscribe(
          (res) => {this.board = res.data; console.log('BOARD:', res.data); },
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
  // LISTS

  addList() {
    this.listToCreate.BoardId = this.boardId;
    this.http.post<ReturnObject>('/api/boards/add-list', this.listToCreate)
        .subscribe(
            (res) => { this.getBoardDetails() }
        );
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // TASKS

  getAllTasks(){
    this.http.get<ReturnObject>('/api/task/' + this.boardId)
        .subscribe(
            (res) => { this.allTasks = res.data; console.log(this.allTasks) },
            (err) => {  }
        )
  }

  moveTask(taskId: string, listId: string){
    this.http.get<ReturnObject>(`/api/task/move/${taskId}/${listId}`)
        .subscribe(
            (res) => {
              alert(res.message);
            },
            (err) => {
              alert('Error');
            }
        )
  }

  addNewTask(){
    this.taskToAdd.ProjectId = this.boardId;
    this.taskToAdd.ListId = this.board.Backlog._id; // Id of default list which is backlog
    this.http.post('/api/task/add-new', this.taskToAdd)
        .subscribe(
            (res) => { this.taskToAdd = new TaskModel(); },
            (err) => { }
        )
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
}
