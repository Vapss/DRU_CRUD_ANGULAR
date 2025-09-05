import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `<button [type]="type"><ng-content /></button>`,
  styles: [``], // TODO: styling via design tokens
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
}
