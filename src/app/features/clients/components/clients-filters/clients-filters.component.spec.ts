import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsFiltersComponent } from './clients-filters.component';

describe('ClientsFiltersComponent', () => {
  let component: ClientsFiltersComponent;
  let fixture: ComponentFixture<ClientsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
