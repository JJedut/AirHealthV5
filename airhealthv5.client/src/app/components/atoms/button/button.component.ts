import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() style: 'filled' | 'outline' | 'accent' | 'outline-accent' = 'outline';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  //@Output() click = new EventEmitter<Event>();

  // handleClick(event: Event) {
  //   if (!this.disabled) {
  //     this.click.emit(event);
  //   }
  // }
}
