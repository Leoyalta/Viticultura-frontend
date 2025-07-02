import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsMapComponent } from './clients-map.component';

describe('ClientsMapComponent', () => {
  let component: ClientsMapComponent;
  let fixture: ComponentFixture<ClientsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
