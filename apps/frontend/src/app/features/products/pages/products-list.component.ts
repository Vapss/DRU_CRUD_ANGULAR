import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-products-list',
  standalone: true,
  template: `
    <h1>Products</h1>
    <!-- TODO: list products -->
  `,
})
export class ProductsListComponent {
  readonly products = signal([]); // TODO: populate via service
}
