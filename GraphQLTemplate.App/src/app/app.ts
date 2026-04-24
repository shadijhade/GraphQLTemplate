import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Subscription as RxJsSubscription } from 'rxjs';

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      isCompleted
      createdAt
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($title: String!) {
    addTask(title: $title) {
      id
      title
      isCompleted
      createdAt
    }
  }
`;

const TOGGLE_TASK = gql`
  mutation ToggleTaskCompletion($id: UUID!) {
    toggleTaskCompletion(id: $id) {
      id
      title
      isCompleted
      createdAt
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: UUID!) {
    deleteTask(id: $id)
  }
`;

const TASK_ADDED_SUB = gql`
  subscription OnTaskAdded {
    onTaskAdded {
      id
      title
      isCompleted
      createdAt
    }
  }
`;

const TASK_UPDATED_SUB = gql`
  subscription OnTaskUpdated {
    onTaskUpdated {
      id
      title
      isCompleted
      createdAt
    }
  }
`;

interface ActivityLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'added' | 'updated' | 'deleted' | 'fetched';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class App implements OnInit, OnDestroy {
  tasks: any[] = [];
  newTaskTitle: string = '';
  loading = true;
  queryTime: Date | null = null;
  error: any;

  activityLog: ActivityLog[] = [];

  private querySubscription!: RxJsSubscription;
  private addedSub!: RxJsSubscription;
  private updatedSub!: RxJsSubscription;

  constructor(private apollo: Apollo, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchTasks();

    // Subscribe to task additions
    this.addedSub = this.apollo.subscribe<any>({
      query: TASK_ADDED_SUB
    }).subscribe(({ data }) => {
      const newTask = data?.onTaskAdded;
      if (newTask) {
        if (!this.tasks.find(t => t.id === newTask.id)) {
          this.tasks = [newTask, ...this.tasks];
        }
        this.addLog('Task Created: ' + newTask.title, 'added');
        this.cdr.markForCheck();
      }
    });

    // Subscribe to task updates
    this.updatedSub = this.apollo.subscribe<any>({
      query: TASK_UPDATED_SUB
    }).subscribe(({ data }) => {
      const updatedTask = data?.onTaskUpdated;
      if (updatedTask) {
        this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        this.addLog('Task Updated: ' + updatedTask.title, 'updated');
        this.cdr.markForCheck();
      }
    });
  }

  fetchTasks() {
    this.loading = true;
    this.cdr.markForCheck();
    
    // Unsubscribe if existing to force network fetch visualization
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_TASKS,
        fetchPolicy: 'network-only' // Force a network request
      })
      .valueChanges.subscribe(({ data, loading, error }) => {
        this.loading = loading;
        this.tasks = [...(data?.tasks || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.error = error;
        this.queryTime = new Date();
        
        if (!loading && data) {
          this.addLog(`Fetched ${this.tasks.length} tasks via Query`, 'fetched');
        }
        this.cdr.markForCheck();
      });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const title = this.newTaskTitle;
    this.newTaskTitle = ''; // clear input early
    
    this.apollo.mutate({
      mutation: ADD_TASK,
      variables: { title }
    }).subscribe(() => {
      // Result handled by subscription to show real-time nature
      this.cdr.markForCheck();
    });
  }

  toggleTask(task: any) {
    this.apollo.mutate({
      mutation: TOGGLE_TASK,
      variables: { id: task.id }
    }).subscribe();
  }

  deleteTask(id: string) {
    this.apollo.mutate({
      mutation: DELETE_TASK,
      variables: { id },
      update: (cache) => {
        const data: any = cache.readQuery({ query: GET_TASKS });
        if (data) {
          cache.writeQuery({
            query: GET_TASKS,
            data: { tasks: data.tasks.filter((t: any) => t.id !== id) }
          });
        }
      }
    }).subscribe(() => {
      const task = this.tasks.find(t => t.id === id);
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.addLog(`Task Deleted: ${task?.title || id}`, 'deleted');
      this.cdr.markForCheck();
    });
  }

  addLog(message: string, type: 'added' | 'updated' | 'deleted' | 'fetched') {
    this.activityLog = [
      { id: Math.random().toString(36).substr(2, 9), timestamp: new Date(), message, type },
      ...this.activityLog
    ].slice(0, 50); // Keep last 50 logs
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
    this.addedSub?.unsubscribe();
    this.updatedSub?.unsubscribe();
  }
}
