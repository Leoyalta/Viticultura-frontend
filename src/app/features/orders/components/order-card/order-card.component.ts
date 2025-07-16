import { Component, Input } from '@angular/core';
import { Order } from '../../models/ordersModel';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgClass,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;

  constructor(private router: Router) {}

  viewOrderDetails(): void {
    if (this.order && this.order._id) {
      this.router.navigate(['/orders', this.order._id]);
    }
  }

  translateStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'En Proceso';
      case 'scheduled':
        return 'Programado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }
}
