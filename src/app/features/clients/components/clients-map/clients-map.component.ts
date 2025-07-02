import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Client } from '../../models/clientsModel';
import { MapboxService } from '../../../../shared/services/mapbox/mapbox.service';

@Component({
  selector: 'app-clients-map',
  standalone: true,
  templateUrl: './clients-map.component.html',
  styleUrl: './clients-map.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ClientsMapComponent implements OnInit, AfterViewInit {
  @Input() clients: Client[] = [];
  private mapbox = inject(MapboxService);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.clients.length) return;

    const firstLocation = this.clients[0].address?.location?.coordinates;
    if (!firstLocation) return;

    this.mapbox.initMap('map', firstLocation, 8);
    this.mapbox.clearMarkers();

    // this.clients.forEach((client) => {
    //   const coords = client.address?.location?.coordinates;
    //   const label = `${client.name} ${client.secondName}`;
    //   if (coords) {
    //     this.mapbox.addMarker(coords, label);
    //   }
    // });
    this.clients.forEach((client) => {
      const coords = client.address?.location?.coordinates;
      const label = `${client.name} ${client.secondName}<br>📞 ${client.phone}`;
      if (coords) {
        this.mapbox.addMarker(coords, label);
      }
    });
  }
}
