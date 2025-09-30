import { Component, EventEmitter, Input, input, Output } from '@angular/core';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  //this is Input decorator syntax for Angular
  @Input({required:true}) id! :string;
  @Input({required:true}) avatar! :string;
  @Input({required:true}) name! :string;
  @Output() select = new EventEmitter();
  

  get imagePath() {
    return 'assets/users/' + this.avatar;
  }

  
  onSelectUser() {
    this.select.emit(this.id);
  }
}
