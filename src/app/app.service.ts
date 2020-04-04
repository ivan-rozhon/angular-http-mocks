import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Sort } from "@angular/material/sort";

import { Subject } from "rxjs";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Criteria {
  sort: Sort;
  pageIndex: number;
  pageSize: number;
}

export interface Data {
  users: User[];
  length: number;
  criteria: Criteria;
}

@Injectable({ providedIn: "root" })
export class AppService {
  private dataSource: Subject<Data> = new Subject();
  data$ = this.dataSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  loadUsers(criteria: Criteria): void {
    this.httpClient.post("getUsers", criteria).subscribe((data: Data) => {
      this.dataSource.next(data);
    });
  }
}
