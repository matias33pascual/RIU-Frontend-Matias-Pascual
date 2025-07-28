import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EffectRef,
  input,
  output,
  OutputEmitterRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Superhero } from '@superheroes/interfaces/superhero.interface';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-superheroes-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './superheroes-list.component.html',
  styleUrl: './superheroes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesListComponent {
  superheroesList = input.required<Superhero[]>();

  addEvent: OutputEmitterRef<void> = output<void>();
  editEvent: OutputEmitterRef<Superhero> = output<Superhero>();
  deleteEvent: OutputEmitterRef<Superhero> = output<Superhero>();

  dataSource: MatTableDataSource<Superhero, MatPaginator> =
    new MatTableDataSource<Superhero>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly _updateDataSourceEffect: EffectRef = effect(() => {
    const data = this.superheroesList();
    this.dataSource.data = [...data];
  });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addSuperhero(): void {
    this.addEvent.emit();
  }

  editSuperhero(superhero: Superhero): void {
    this.editEvent.emit(superhero);
  }

  deleteSuperhero(superhero: Superhero): void {
    this.deleteEvent.emit(superhero);
  }
}
