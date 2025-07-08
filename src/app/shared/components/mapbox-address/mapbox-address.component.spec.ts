import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxAddressComponent } from './mapbox-address.component';

describe('MapboxAddressComponent', () => {
  let component: MapboxAddressComponent;
  let fixture: ComponentFixture<MapboxAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapboxAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapboxAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
