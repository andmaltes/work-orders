import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeHeader } from "./components/home-header/home-header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('work-orders');
}
