import { Component } from '@angular/core';

import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // <-- fix here
})
export class AppComponent {}