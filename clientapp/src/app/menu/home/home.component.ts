import { Component } from '@angular/core';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    users?: User[];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = true;
    }
}