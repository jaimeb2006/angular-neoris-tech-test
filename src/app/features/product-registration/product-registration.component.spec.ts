import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ProductRegistrationComponent } from './product-registration.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FinancialProductsService } from '../../core/services/financial-products.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Actualiza los mocks para reflejar el comportamiento esperado en caso de error
const mockFinancialProductsService = {
  checkIfIdExists: jest.fn().mockReturnValue(of(false)),
  addAndUpdateFinancialProduct: jest.fn(),
  currentProduct: of(null),
};

const mockNotificationService = {
  showNotification: jest.fn(),
  setViewContainerRef: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('ProductRegistrationComponent', () => {
  let component: ProductRegistrationComponent;
  let fixture: ComponentFixture<ProductRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductRegistrationComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: FinancialProductsService,
          useValue: mockFinancialProductsService,
        },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Aquí configuras el mock para addAndUpdateFinancialProduct antes de cada prueba
    mockFinancialProductsService.addAndUpdateFinancialProduct.mockReturnValue(
      of({})
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Restablece los mocks a su estado original
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.productForm.valid).toBeFalsy();
  });

  it('id field validity', () => {
    let id = component.productForm.controls['id'];
    expect(id.valid).toBeFalsy();
    id.setValue('');
    expect(id.hasError('required')).toBeTruthy();
    id.setValue('A');
    expect(id.hasError('minlength')).toBeTruthy();
  });

  it('should checkEditMode and set isEditMode to false if no product', () => {
    // Asignar currentProduct como observable de null simula que no hay producto seleccionado
    mockFinancialProductsService.currentProduct = of(null);
    component.checkEditMode();
    expect(component.isEditMode).toBe(false);
  });

  it('onSubmit should call addAndUpdateFinancialProduct if form is valid', fakeAsync(() => {
    component.productForm.controls['id'].setValue('123333333');
    component.productForm.controls['name'].setValue('Test Product');
    component.productForm.controls['description'].setValue(
      'Test Description0000000'
    );
    component.productForm.controls['logo'].setValue(
      'http://example.com/logo.png'
    );
    component.productForm.controls['release_date'].setValue(
      new Date('2025-01-01')
    );
    component.productForm.controls['revision_date'].setValue(
      new Date('2025-01-01')
    );

    component.isEditMode = false;
    component.onSubmit();
    tick(5000);
    expect(
      mockFinancialProductsService.addAndUpdateFinancialProduct
    ).toHaveBeenCalled();
  }));

  it('onSubmit should not call addAndUpdateFinancialProduct if form is invalid', () => {
    component.ngOnInit(); // O inicializa manualmente el formulario si no usas ngOnInit para esto.

    // Hacer el formulario inválido manualmente podría implicar establecer un valor inválido para uno de los controles,
    // o simplemente no establecer valores en un formulario que requiere ciertos campos.
    component.productForm.controls['id'].setValue(''); // Suponiendo que 'id' es un campo requerido.

    // Ahora el formulario debería ser inválido.
    expect(component.productForm.valid).toBeFalsy();
    component.onSubmit();

    // Verifica que la función no haya sido llamada ya que el formulario es inválido.
    expect(
      mockFinancialProductsService.addAndUpdateFinancialProduct
    ).not.toHaveBeenCalled();
  });

  it('validateReleaseDate should return null for valid dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const control = { value: futureDate.toISOString().split('T')[0] };
    const result = component.validateReleaseDate(control as any);
    expect(result).toBeNull();
  });

  it('should mark id as valid for new IDs not taken', waitForAsync(() => {
    mockFinancialProductsService.checkIfIdExists.mockReturnValue(of(false));
    const control = component.productForm.controls['id'];
    control.setValue('newId');
    fixture.whenStable().then(() => {
      expect(control.valid).toBeTruthy();
    });
  }));

  it('should mark id as invalid for existing IDs', waitForAsync(() => {
    mockFinancialProductsService.checkIfIdExists.mockReturnValue(of(true));
    const control = component.productForm.controls['id'];
    control.setValue('existingId');
    fixture.whenStable().then(() => {
      expect(control.errors).toEqual({ idTaken: true });
    });
  }));

  it('should update revision_date based on release_date', fakeAsync(() => {
    const today = new Date().toISOString().substring(0, 10);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearString = nextYear.toISOString().substring(0, 10);

    component.productForm.controls['release_date'].setValue(today);
    tick();
    expect(component.productForm.controls['revision_date'].value).toEqual(
      nextYearString
    );
  }));
});
