import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuperheroesPageComponent } from "@superheroes/pages/superheroes-page/superheroes-page.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SuperheroesPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RIU-Frontend-Matias-Pascual';
}
