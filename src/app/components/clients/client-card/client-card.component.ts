import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../../models/clientsModel';

@Component({
  selector: 'app-client-card',
  imports: [MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss',
})
export class ClientCardComponent {
  @Input() client!: Client;
  @Output() showOnMap = new EventEmitter<Client>();
}
