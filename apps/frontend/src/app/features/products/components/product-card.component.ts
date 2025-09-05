import { Component, Input } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div>
      <!-- TODO: card layout -->
      {{ product?.name }}
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product?: Product;
}
