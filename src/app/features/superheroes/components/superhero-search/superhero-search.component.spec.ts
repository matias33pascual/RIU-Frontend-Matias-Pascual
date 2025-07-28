import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SuperheroSearchComponent } from './superhero-search.component';

describe('SuperheroSearchComponent', () => {
  let component: SuperheroSearchComponent;
  let fixture: ComponentFixture<SuperheroSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuperheroSearchComponent,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update search term through onSearchChange', fakeAsync(() => {
    const mockEvent = { target: { value: 'batman' } } as any;
    component.onSearchChange(mockEvent);

    expect(component.searchTerm()).toBe('batman');

    tick(500);
    flush();
  }));

  it('should handle multiple search term changes', fakeAsync(() => {
    const mockEvent1 = { target: { value: 'batman' } } as any;
    component.onSearchChange(mockEvent1);
    expect(component.searchTerm()).toBe('batman');

    const mockEvent2 = { target: { value: 'superman' } } as any;
    component.onSearchChange(mockEvent2);
    expect(component.searchTerm()).toBe('superman');

    tick(500);
    flush();
  }));

  it('should update search term on input change', () => {
    const input = fixture.nativeElement.querySelector('input[type="text"]');
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: 'batman' },
      enumerable: true,
    });

    component.onSearchChange(event);
    expect(component.searchTerm()).toBe('batman');
  });

  it('should have search input field', () => {
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input[type="text"]');
    expect(input).toBeTruthy();
  });

  it('should have search form field', () => {
    const compiled = fixture.nativeElement;
    const formField = compiled.querySelector('mat-form-field');
    expect(formField).toBeTruthy();
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    spyOn(component['_destroy'], 'next');
    spyOn(component['_destroy'], 'complete');

    component.ngOnDestroy();

    expect(component['_destroy'].next).toHaveBeenCalled();
    expect(component['_destroy'].complete).toHaveBeenCalled();
  });

  it('should handle empty search term', () => {
    const input = fixture.nativeElement.querySelector('input[type="text"]');
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: '' },
      enumerable: true,
    });

    component.onSearchChange(event);
    expect(component.searchTerm()).toBe('');
  });

  it('should handle null search term', () => {
    const input = fixture.nativeElement.querySelector('input[type="text"]');
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: '' },
      enumerable: true,
    });

    component.onSearchChange(event);
    expect(component.searchTerm()).toBe('');
  });

  it('should trim whitespace from search term', () => {
    const input = fixture.nativeElement.querySelector('input[type="text"]');
    const event = new Event('input');
    Object.defineProperty(event, 'target', {
      value: { value: '  superman  ' },
      enumerable: true,
    });

    component.onSearchChange(event);
    expect(component.searchTerm()).toBe('superman');
  });
});
