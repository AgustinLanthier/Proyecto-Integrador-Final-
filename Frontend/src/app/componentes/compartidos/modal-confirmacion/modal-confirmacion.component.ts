import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: false,
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.scss',
})
export class ModalConfirmacionComponent {
  @Input() visible = false;
  @Input() titulo = '¿Estás seguro?';
  @Input() mensaje = '';
  @Input() textoConfirmar = 'Aceptar';
  @Input() textoCancelar = 'Cancelar';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.visible) this.cancelar.emit();
  }
}