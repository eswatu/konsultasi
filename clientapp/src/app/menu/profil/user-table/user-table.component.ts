import { Component } from '@angular/core';
import { User } from '@app/_models';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {
  users: User[] = [
    // some sample users
    {username: 'alice', password: '1234', name: 'Alice', company: 'ABC', role: 'admin', contact: 'alice@abc.com', jwtToken: 'token1'},
    {username: 'bob', password: '5678', name: 'Bob', company: 'XYZ', role: 'user', contact: 'bob@xyz.com', jwtToken: 'token2'}
  ];
  displayedColumns: string[] = ['username', 'password', 'name', 'company', 'role', 'contact', 'jwtToken'];
}
