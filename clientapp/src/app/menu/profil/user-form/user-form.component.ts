import { Component } from '@angular/core';
import { User } from '@app/_models';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  user: User = new User();
  closeDialog() {
    
  }
}
