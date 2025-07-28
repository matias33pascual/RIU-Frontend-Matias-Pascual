import { Component, OnDestroy, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-superhero-search',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './superhero-search.component.html',
  styleUrl: './superhero-search.component.scss',
})
export class SuperheroSearchComponent implements OnDestroy {
  searchByName = output<string>();
  searchTerm = signal('');

  private readonly _destroy = new Subject<void>();

  constructor() {
    toObservable(this.searchTerm)
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe((term) => this.searchByName.emit(term));
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value.trim() ?? '');
  }
}
