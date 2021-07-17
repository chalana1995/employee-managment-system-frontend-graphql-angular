import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


const GET_PROJECTS = gql`
query {
  Allproject {
    id
    name
    code
  }
}
`

const CREATE_PROJECT = gql`
mutation ($name: String!, $code: Int!) {
  createProject(project : {name: $name, code: $code})
  {
    id
    name
    code
  }
}
`

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public columns: any[] = [
    { field: "id" },
    { field: "name" },
    { field: "code" },
  ];

  public view: Observable<GridDataResult>;
  public gridData: any;
  public gridDataResult: GridDataResult = {
    data: [],
    total: 0
  };

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_PROJECTS
    }).valueChanges.subscribe((res: any) => {
      console.log("==== project res ====", res.data.Allproject);
      this.gridData = res.data.Allproject;
    })
  }

  create(name: String, code: Number) {
    this.apollo.mutate({
      mutation: CREATE_PROJECT,
      refetchQueries: [{ query: GET_PROJECTS }],
      variables: {
        name: name,
        code: Number(code)
      }
    }).subscribe(() => {
      console.log("Created");
      name : '';
      code : null
    })
  }

}
