import { Component } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `<div class="card"><ng-content /></div>`,
  styles: [``], // TODO: styling via design tokens
})
export class CardComponent {}
