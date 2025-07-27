import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperheroSearchComponent } from './superhero-search.component';

describe('SuperheroSearchComponent', () => {
  let component: SuperheroSearchComponent;
  let fixture: ComponentFixture<SuperheroSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperheroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
