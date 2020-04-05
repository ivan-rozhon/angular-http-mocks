import { Provider, APP_INITIALIZER } from "@angular/core";

import {
  HttpMocksService,
  MockScenarios,
  RequestQuery,
  RequestBody
} from "http-mocks";

import faker from "faker";

import { User } from "./app.service";

export const httpMocksProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: httpMocksProviderFactory,
  deps: [HttpMocksService],
  multi: true
};

// Create factory function for the http-mocks provider
function httpMocksProviderFactory(httpMocksService: HttpMocksService) {
  return () =>
    httpMocksService.setHttpMocks(mocks, {
      loggingEnabled: true
    });
}

// generate users just once
const generatedUsers: User[] = generateUsers(105);

// Prepare mocks at least for the `default` scenario
const mocks: MockScenarios = {
  default: [
    {
      url: /getUsers/,
      method: "POST",
      responseFn: (requestQuery: RequestQuery, requestBody: RequestBody) => {
        const pageIndex = requestBody.pageIndex;
        const pageSize = requestBody.pageSize;

        return {
          criteria: requestBody,
          length: generatedUsers.length,
          users: generatedUsers
            .sort(
              sortRecords(requestBody.sort.active, requestBody.sort.direction)
            )
            .slice(0 + pageIndex * pageSize, pageIndex * pageSize + pageSize)
        };
      },
      delay: 1500,
      responseCode: 200
    }
  ]
};

function generateUsers(length: number): User[] {
  const users = [];

  for (let i = 0; i < length; i++) {
    users.push({
      id: i + 1,
      name: faker.name.firstName(),
      email: faker.internet.email()
    });
  }

  return users;
}

function sortRecords(attrName: string, direction: string): (a, b) => number {
  return (a: any, b: any) => {
    const nameA = a[attrName];
    const nameB = b[attrName];

    if (nameA < nameB) {
      return direction === "asc" ? -1 : 1;
    }
    if (nameA > nameB) {
      return direction === "asc" ? 1 : -1;
    }

    return 0;
  };
}
