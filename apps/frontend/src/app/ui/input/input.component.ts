import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-input',
  standalone: true,
  template: `<input [type]="type" />`,
  styles: [``], // TODO: styling via design tokens
})
export class InputComponent {
  @Input() type = 'text';
}
