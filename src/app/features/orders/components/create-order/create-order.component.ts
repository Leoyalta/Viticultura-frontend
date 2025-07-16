import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { OrdersService } from '../orders.service';
import { ClientsService } from '../../../clients/services/clients/clients.service';
import { ProductsService } from '../../../products/services/products/products.service';
import { Client } from '../../../clients/models/clientsModel';
import { Product } from '../../../products/models/productsModel';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    FullCalendarModule,
  ],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  orderForm: FormGroup;
  clients: Client[] = [];
  products: Product[] = [];

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    events: [],
    views: {
      dayGridMonth: {
        buttonText: 'mes',
      },
      dayGridWeek: {
        buttonText: 'semana',
      },
      dayGridDay: {
        buttonText: 'día',
      },
    },
  };

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
    this.orderForm = this.fb.group({
      client: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      plantingRequested: [false],
      plantingDate: [null],
      status: ['pending', Validators.required],
    });

    this.orderForm
      .get('plantingRequested')
      ?.valueChanges.subscribe((requested) => {
        const plantingDateControl = this.orderForm.get('plantingDate');
        if (requested) {
          plantingDateControl?.setValidators(Validators.required);
        } else {
          plantingDateControl?.clearValidators();
          plantingDateControl?.setValue(null);
        }
        plantingDateControl?.updateValueAndValidity();
      });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
  }

  loadClients(): void {
    this.clientsService.updateQueryParams({ page: 1, per_page: 1000 });
    this.clientsService.getAllClientsWithParams().subscribe({
      next: (response) => {
        this.clients = response.clients;
      },
      error: (error) =>
        console.error('Error al cargar clientes para el desplegable:', error),
    });
  }

  loadProducts(): void {
    this.productsService.updateQueryParams({ page: 1, per_page: 1000 });
    this.productsService.getAllProductsWithParams().subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (error) =>
        console.error('Error al cargar productos para el desplegable:', error),
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const selectedDate = selectInfo.startStr;
    if (this.orderForm.get('plantingRequested')?.value) {
      this.orderForm.get('plantingDate')?.setValue(selectedDate);
    } else {
      console.warn(
        'Fecha seleccionada en el calendario, pero "¿Se requiere plantación?" no está marcado.'
      );
    }
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValues = this.orderForm.value;

      const newOrderPayload: {
        client: string;
        product: string;
        quantity: number;
        plantingRequested: boolean;
        plantingDate?: string;
        status: string;
      } = {
        client: formValues.client,
        product: formValues.product,
        quantity: formValues.quantity,
        plantingRequested: formValues.plantingRequested,
        status: formValues.status,
      };

      if (formValues.plantingRequested && formValues.plantingDate) {
        newOrderPayload.plantingDate =
          formValues.plantingDate instanceof Date
            ? formValues.plantingDate.toISOString()
            : new Date(formValues.plantingDate).toISOString();
      } else if (!formValues.plantingRequested) {
        delete newOrderPayload.plantingDate;
      }

      this.ordersService.createOrder(newOrderPayload).subscribe({
        next: (order) => {
          this.snackBar.open('Pedido creado exitosamente ✅', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.orderForm.reset({
            quantity: 1,
            plantingRequested: false,
            status: 'pending',
          });
        },
        error: (error) => {
          let errorMessage = 'Error al crear pedido. ❌';
          if (error.error && error.error.message) {
            errorMessage = `Error: ${error.error.message}`;
          }
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    } else {
      this.orderForm.markAllAsTouched();
      this.snackBar.open(
        'Por favor, completa todos los campos requeridos. ⚠️',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['snackbar-warning'],
        }
      );
    }
  }
}
