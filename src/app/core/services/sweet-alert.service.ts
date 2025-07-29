import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  private readonly defaultConfig = {
    background: '#1e1e1e',
    color: '#ffffff',
    confirmButtonColor: '#0044ffff',
    cancelButtonColor: '#dd3333',
  };

  success(title: string, text?: string) {
    return Swal.fire({
      ...this.defaultConfig,
      icon: 'success' as SweetAlertIcon,
      title,
      text,
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      ...this.defaultConfig,
      icon: 'error' as SweetAlertIcon,
      title,
      text,
    });
  }

  warning(title: string, text?: string) {
    return Swal.fire({
      ...this.defaultConfig,
      icon: 'warning' as SweetAlertIcon,
      title,
      text,
    });
  }

  info(title: string, text?: string) {
    return Swal.fire({
      ...this.defaultConfig,
      icon: 'info' as SweetAlertIcon,
      title,
      text,
    });
  }

  confirm(
    title: string,
    text?: string,
    confirmText: string = 'Sí, confirmar',
    cancelText: string = 'Cancelar'
  ) {
    return Swal.fire({
      ...this.defaultConfig,
      icon: 'warning' as SweetAlertIcon,
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  }

  confirmDelete(itemName: string) {
    return Swal.fire({
      ...this.defaultConfig,
      title: `¿Seguro que querés borrar a ${itemName}?`,
      icon: 'warning' as SweetAlertIcon,
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'No, cancelar',
    });
  }

  custom(options: SweetAlertOptions) {
    return Swal.fire({
      ...this.defaultConfig,
      ...options,
    } as SweetAlertOptions);
  }

  close() {
    Swal.close();
  }
}
