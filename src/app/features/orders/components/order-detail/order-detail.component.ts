import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdersService } from '../orders.service';
import { Order } from '../../models/ordersModel';

import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgClass,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  orderId: string | null = null;
  isLoading = true;
  errorMessage: string = '';

  statusOptions = [
    'pending',
    'processing',
    'scheduled',
    'completed',
    'cancelled',
  ];
  selectedStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrderDetails(this.orderId);
    } else {
      this.snackBar.open('Error: ID de pedido no proporcionado.', 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
      this.router.navigate(['/orders']);
    }
  }

  loadOrderDetails(id: string): void {
    this.isLoading = true;
    this.ordersService.getOrderById(id).subscribe({
      next: (response) => {
        this.order = response.order;
        if (this.order) {
          this.selectedStatus = this.order.status;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los detalles del pedido:', error);
        this.errorMessage =
          'No se pudo cargar el pedido. Por favor, intente de nuevo.';
        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
        this.router.navigate(['/orders']);
      },
    });
  }

  onDeleteOrder(): void {
    if (!this.orderId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: '¿Estás seguro de que quieres eliminar este pedido?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.orderId) {
        this.ordersService.deleteOrder(this.orderId).subscribe({
          next: () => {
            this.snackBar.open('Pedido eliminado exitosamente ✅', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            console.error('Error al eliminar pedido:', error);
            let errorMessage = 'Error al eliminar pedido ❌';
            if (error.error && error.error.message) {
              errorMessage = `Error: ${error.error.message}`;
            }
            this.snackBar.open(errorMessage, 'Cerrar', {
              duration: 5000,
              panelClass: ['snackbar-error'],
            });
          },
        });
      }
    });
  }

  onStatusChange(newStatus: string): void {
    if (!this.order || this.order.status === newStatus) {
      return;
    }

    const orderId = this.order._id;
    const updatedData: Partial<Order> = { status: newStatus };

    this.ordersService.updateOrder(orderId, updatedData).subscribe({
      next: (response) => {
        const updatedOrder = response.data;

        this.snackBar.open('Pedido actualizado ✅', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.order = updatedOrder;
        this.selectedStatus = updatedOrder.status;
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error al actualizar estado del pedido:', error);
        let errorMessage = 'Error al actualizar estado del pedido ❌';
        if (error.error && error.error.message) {
          errorMessage = `Error: ${error.error.message}`;
        }
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  goBackToList(): void {
    this.router.navigate(['/orders']);
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
