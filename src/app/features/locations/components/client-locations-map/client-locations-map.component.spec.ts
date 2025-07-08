import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLocationsMapComponent } from './client-locations-map.component';

describe('ClientLocationsMapComponent', () => {
  let component: ClientLocationsMapComponent;
  let fixture: ComponentFixture<ClientLocationsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLocationsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLocationsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
