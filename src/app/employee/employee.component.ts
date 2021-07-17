import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

const GET_EMPLOYEES = gql`
query {
  getAllEmployees {
    firstName
    lastName
    designation
    city
  }
}
`

const CREATE_EMPLOYEE = gql`
mutation ($firstName: String!, $lastName: String!, $designation: String!, $city: String!, $projectId: String!) {
createEmployee(employeeInput: {firstName: $firstName, lastName: $lastName, designation: $designation, city:$city, projectId:$projectId})
{
  id
  firstName
  lastName
  designation
  city
  projectId
}
}
`

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  public columns: any[] = [
    { field: "firstName" },
    { field: "lastName" },
    { field: "designation" },
    { field: "city" },
  ];

  public view: Observable<GridDataResult>;
  employees: Observable<any>;
  public gridData: any;
  public gridDataResult: GridDataResult = {
    data: [],
    total: 0
  };

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_EMPLOYEES
    }).valueChanges.pipe(
      map((result: any) => {
        console.log("====== result ====", result.data.getAllEmployees);
        this.gridData = result.data.getAllEmployees
        // this.gridDataResult.data = result.data.getAllEmployees
      })
    ).subscribe((res: any) => {
      console.log("====== result ====", res);
    })
  }

  create(firstName: string, lastName: string, designation: string, city: string, projectId: string) {
    this.apollo.mutate({
      mutation: CREATE_EMPLOYEE,
      refetchQueries: [{ query: GET_EMPLOYEES }],
      variables: {
        firstName,
        lastName,
        designation,
        city,
        projectId
      }
    }).subscribe(() => {
      console.log("Employee Created");
    })

  }



}
