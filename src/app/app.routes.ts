import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'superheroes',
    loadComponent: () =>
      import(
        './features/superheroes/pages/superheroes-page/superheroes-page.component'
      ).then((c) => c.SuperheroesPageComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about-page/about-page.component').then(
        (c) => c.AboutPageComponent
      ),
  },
  {
    path: '',
    redirectTo: 'superheroes',
    pathMatch: 'full',
  },
];
