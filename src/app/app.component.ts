import { Component, OnInit } from "@angular/core";

import { Sort } from "@angular/material/sort";

import { switchMap, pluck } from "rxjs/operators";

import { AppService, Criteria, User } from "./app.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "email"];

  constructor(public appService: AppService) {}

  ngOnInit(): void {
    this.appService.loadUsers({
      sort: { active: "id", direction: "asc" },
      pageIndex: 0,
      pageSize: 10
    });
  }

  searchUsers(criteria: Criteria, update: Partial<Criteria>): void {
    const updatedCriteria = { ...criteria, ...update };

    this.appService.loadUsers(updatedCriteria);
  }
}
