import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationConfirmarComponent } from './notification-confirmar.component';
import { FinancialProductsService } from '../../../core/services/financial-products.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { FinancialProduct } from '../../../core/models/financial-product.model';
import { of, throwError } from 'rxjs';

// Mocks para los servicios y el router
const mockFinancialProductsService = {
  deleteFinancialProduct: jest.fn(),
};

const mockNotificationService = {
  setViewContainerRef: jest.fn(),
  showNotification: jest.fn(),
};

const mockRouter = {
  navigateByUrl: jest.fn().mockReturnValue(Promise.resolve(true)),
};

describe('NotificationConfirmarComponent', () => {
  let component: NotificationConfirmarComponent;
  let fixture: ComponentFixture<NotificationConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationConfirmarComponent],
      providers: [
        {
          provide: FinancialProductsService,
          useValue: mockFinancialProductsService,
        },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display confirmation popup', () => {
    const mockProduct: FinancialProduct = {
      id: '1',
      name: 'Test Product',
      description: '',
      releaseDate: new Date(),
      revisionDate: new Date(),
      logoUrl: '',
    };
    component.display({ producto: mockProduct });
    expect(component.show).toBe(true);
    expect(component.title).toBe(mockProduct.name);
    expect(component.id).toBe(mockProduct.id);
  });

  it('should close popup', () => {
    component.closePopup();
    expect(component.show).toBe(false);
  });

  it('should handle confirm delete success', async () => {
    mockFinancialProductsService.deleteFinancialProduct.mockReturnValue(of({}));
    await component.confirmDelete();
    expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
      'Producto eliminado con éxito',
      'Producto Eliminado',
      'success'
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/product-list', {
      skipLocationChange: true,
    });
  });

  it('should handle confirm delete error', async () => {
    mockFinancialProductsService.deleteFinancialProduct.mockReturnValue(
      throwError(() => new Error('Error'))
    );
    await component.confirmDelete();
    expect(mockNotificationService.showNotification).toHaveBeenCalledWith(
      'Error al eliminar el producto',
      'Producto no eliminado',
      'error'
    );
  });
});
