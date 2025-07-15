import { Component, Input } from '@angular/core';
import { Order } from '../../models/ordersModel';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatButtonModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
}
