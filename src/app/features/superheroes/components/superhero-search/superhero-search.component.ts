import {
  Component,
  DestroyRef,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-superhero-search',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './superhero-search.component.html',
  styleUrl: './superhero-search.component.scss',
})
export class SuperheroSearchComponent {
  searchByName = output<string>();
  searchTerm = signal('');

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    toObservable(this.searchTerm)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((term) => this.searchByName.emit(term));
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value.trim() ?? '');
  }
}
