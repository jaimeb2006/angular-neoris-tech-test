import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FinancialProduct } from '../../core/models/financial-product.model';
import { FinancialProductsService } from '../../core/services/financial-products.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-product-registration',
  templateUrl: './product-registration.component.html',
  styleUrls: ['./product-registration.component.css'],
})
export class ProductRegistrationComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  currentProduct: FinancialProduct | null = null;
  showSuccessMessage = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private financialProductsService: FinancialProductsService,
    private notificationService: NotificationService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
    // Proporciona el ViewContainerRef al servicio de notificaciones
    this.notificationService.setViewContainerRef(this.viewContainerRef);
  }

  // Inicializa el formulario con validaciones y lógica de negocio.
  private initializeForm(): void {
    const today = new Date().toISOString().substring(0, 10); // Fecha de hoy en formato YYYY-MM-DD
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1); // Fecha de un año después

    this.productForm = this.fb.group({
      id: [
        { value: '', disabled: this.isEditMode },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [this.validateIdNotTaken()],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      release_date: [today, [Validators.required, this.validateReleaseDate]],
      revision_date: [
        { value: nextYear.toISOString().substring(0, 10), disabled: true },
        Validators.required,
      ],
    });

    // Actualiza automáticamente la fecha de revisión cuando cambia la fecha de lanzamiento
    this.productForm.get('release_date')?.valueChanges.subscribe((value) => {
      this.updateRevisionDate(value);
    });
  }
  public checkEditMode(): void {
    this.financialProductsService.currentProduct.subscribe((product) => {
      if (product) {
        this.isEditMode = true;
        this.currentProduct = product; // Asume que tienes una propiedad para mantener el producto actual
        this.initializeFormWithProduct(product); // Inicializa el formulario con los datos del producto
      } else {
        this.isEditMode = false;
        this.currentProduct = null;
        this.initializeForm();
      }
    });
  }

  private initializeFormWithProduct(product: FinancialProduct): void {
    this.initializeForm();
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logoUrl,
      release_date: product.releaseDate.toISOString().substring(0, 10),
      revision_date: product.revisionDate.toISOString().substring(0, 10),
    });
  }

  // Valida que la fecha de lanzamiento no sea anterior a hoy.
  validateReleaseDate(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value).toISOString().split('T')[0];
    if (selectedDate >= new Date().toISOString().split('T')[0]) {
      return null; // Fecha válida
    }
    return { releaseDateInvalid: true }; // Fecha inválida
  }

  // Valida que el ID del producto no esté ya tomado.

  validateIdNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || this.isEditMode) {
        return of(null) as Observable<ValidationErrors | null>;
      }
      return this.financialProductsService.checkIfIdExists(control.value).pipe(
        catchError(() => of(null)),
        map((isTaken) => (isTaken ? { idTaken: true } : null))
      ) as Observable<ValidationErrors | null>;
    };
  }

  // Actualiza la fecha de revisión basada en la fecha de lanzamiento seleccionada.
  private updateRevisionDate(value: string): void {
    const releaseDate = new Date(value);
    releaseDate.setFullYear(releaseDate.getFullYear() + 1); // Añade un año
    this.productForm
      .get('revision_date')
      ?.setValue(releaseDate.toISOString().substring(0, 10));
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const productData = this.productForm.getRawValue(); // Usa getRawValue para incluir campos deshabilitados
      const newProduct = new FinancialProduct(
        productData.id,
        productData.name,
        productData.description,
        new Date(productData.release_date),
        new Date(productData.revision_date),
        productData.logo
      );

      this.financialProductsService
        .addAndUpdateFinancialProduct(newProduct, this.isEditMode)
        .subscribe({
          next: () => {
            this.resetForm();
            this.isLoading = false;
            if (this.isEditMode) {
              this.notificationService.showNotification(
                'Producto editado con éxito',
                'Producto editado',
                'success'
              );
            } else {
              this.notificationService.showNotification(
                'Producto creado con éxito',
                'Producto creado',
                'success'
              );
            }
            this.isEditMode = false;
          },
          error: (error) => {
            // console.error('Error creating product:', error);
            this.isLoading = false;
            if (this.isEditMode) {
              this.notificationService.showNotification(
                'Error al editar el producto',
                'Producto no editado',
                'error'
              );
            } else {
              this.notificationService.showNotification(
                'Error al crear el producto',
                'Producto no creado',
                'error'
              );
            }
          },
        });
    } else {
      // console.error('Form is not valid');
    }
  }

  // Restablece el formulario a su estado inicial
  resetForm(): void {
    this.productForm.reset();
    this.initializeForm(); // Re-inicializa el formulario para restablecer valores predeterminados y lógica
  }
}
