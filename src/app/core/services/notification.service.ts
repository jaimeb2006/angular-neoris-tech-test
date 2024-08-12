import {
  Injectable,
  Type,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { NotificationConfirmarComponent } from '../../shared/components/notification-confirmar/notification-confirmar.component';
import { NotificationPopUpComponent } from '../../shared/components/notification-pop-up/notification-pop-up.component';
import { FinancialProduct } from '../models/financial-product.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private viewContainerRef!: ViewContainerRef;

  constructor() {}

  public setViewContainerRef(vcr: ViewContainerRef) {
    this.viewContainerRef = vcr;
  }
  // Método para notificaciones de pop-up regulares
  public showNotification(
    message: string,
    title: string,
    messageType: 'success' | 'error'
  ): void {
    const options = { message, title, messageType };
    this.createComponent(NotificationPopUpComponent, options);
  }

  // Método para confirmaciones
  public showConfirmation(producto: FinancialProduct): void {
    const options = { producto };
    this.createComponent(NotificationConfirmarComponent, options);
  }

  // Método genérico privado para crear componentes de notificación
  public createComponent<T>(component: Type<T>, options: any): ComponentRef<T> {
    // ... verifica que ViewContainerRef ha sido establecido

    // Crea el componente
    const componentRef = this.viewContainerRef?.createComponent(component);

    // Asigna las opciones al componente usando la firma correcta
    if (componentRef.instance instanceof NotificationPopUpComponent) {
      (componentRef.instance as NotificationPopUpComponent).display(
        options.message,
        options.title,
        options.messageType
      );
    } else if (
      componentRef.instance instanceof NotificationConfirmarComponent
    ) {
      (componentRef.instance as NotificationConfirmarComponent).display({
        producto: options.producto,
      });
    } else {
      // console.error('Tipo de componente no reconocido para display');
    }

    return componentRef;
  }
}
