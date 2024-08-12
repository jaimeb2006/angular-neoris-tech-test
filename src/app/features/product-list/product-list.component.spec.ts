// Importaciones necesarias
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { FinancialProductsService } from '../../core/services/financial-products.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

// Mocks definidos fuera del bloque describe
const mockFinancialProductsService = {
  getFinancialProducts: jest.fn().mockReturnValue(
    of({
      products: [],
      totalRecords: 0,
    })
  ),
  changeProduct: jest.fn(),
};

const mockNotificationService = {
  showConfirmation: jest.fn(),
  setViewContainerRef: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        {
          provide: FinancialProductsService,
          useValue: mockFinancialProductsService,
        },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Este detectChanges() ahora invoca ngOnInit después de que el mock está en su lugar.
  });

  it('debería inicializar valores y cargar productos financieros en ngOnInit', () => {
    expect(
      mockFinancialProductsService.getFinancialProducts
    ).toHaveBeenCalled();
    expect(component.financialProducts).toEqual([]);
    expect(component.totalProducts).toEqual(0);
  });

  describe('loadFinancialProducts', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock console.error antes de cada prueba
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      // Restaura console.error a su implementación original después de cada prueba
      consoleErrorSpy.mockRestore();
    });

    it('debería cargar productos financieros correctamente', fakeAsync(() => {
      const mockResponse = {
        products: [
          {
            id: '1',
            name: 'Producto 1',
            description: 'Descripción 1',
            releaseDate: new Date(),
            revisionDate: new Date(),
            logoUrl: '',
          },
        ],
        totalRecords: 1,
      };
      mockFinancialProductsService.getFinancialProducts.mockReturnValue(
        of(mockResponse)
      );
      component.loadFinancialProducts();
      tick();
      expect(component.financialProducts.length).toBe(1);
      expect(component.totalProducts).toBe(1);
      expect(component.loading).toBe(false);
    }));

    it('debería manejar errores al cargar productos financieros', fakeAsync(() => {
      mockFinancialProductsService.getFinancialProducts.mockReturnValue(
        throwError(() => new Error('Error al cargar'))
      );
      component.loadFinancialProducts();
      tick();
      expect(component.financialProducts.length).toBe(0);
      expect(component.loading).toBe(false);
      // Verifica que console.error fue llamado
      expect(consoleErrorSpy).toHaveBeenCalled();
    }));
  });

  describe('Paginación', () => {
    beforeEach(() => {
      // Restablecer los mocks si es necesario
      mockFinancialProductsService.getFinancialProducts.mockClear();
      mockRouter.navigate.mockClear();

      fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      // Configuración inicial necesaria para los tests de paginación
      component.totalProducts = 15; // Asume que hay 15 productos en total
      component.pageSize = 5; // Asume que se muestran 5 productos por página
      component.calculateTotalPages(); // Actualiza totalPages basado en totalProducts y pageSize
      fixture.detectChanges(); // Asegura que el componente esté correctamente inicializado antes de cada prueba
    });

    it('debería calcular el total de páginas correctamente', () => {
      component.totalProducts = 10;
      component.pageSize = 5;
      component.calculateTotalPages();
      expect(component.totalPages).toBe(2);
    });

    it('debería generar números de página correctamente', () => {
      component.totalPages = 3;
      component.generatePageNumbers();
      expect(component.pages.length).toBe(3);
      expect(component.pages).toEqual([1, 2, 3]);
    });

    it('debería navegar a la página especificada', () => {
      component.totalPages = 3;
      fixture.detectChanges(); // Asegura que el componente esté actualizado
      const spyLoadFinancialProducts = jest.spyOn(
        component,
        'loadFinancialProducts'
      );
      component.navigateToPage(2);
      expect(component.currentPage).toBe(2);
      expect(spyLoadFinancialProducts).toHaveBeenCalledWith(2);
    });
  });

  describe('Búsqueda', () => {
    it('debería actualizar término de búsqueda y recargar productos', fakeAsync(() => {
      const spyLoadFinancialProducts = jest.spyOn(
        component,
        'loadFinancialProducts'
      );
      component.searchControl.setValue('nuevo término');
      tick(300); // Debounce time
      expect(component.searchTerm).toBe('nuevo término');
      expect(spyLoadFinancialProducts).toHaveBeenCalled();
    }));
  });

  describe('Interacciones de Usuario', () => {
    it('debería eliminar un producto', () => {
      const mockProduct = {
        id: '1',
        name: 'Producto 1',
        description: '',
        releaseDate: new Date(),
        revisionDate: new Date(),
        logoUrl: '',
      };
      const spyShowConfirmation = jest.spyOn(
        mockNotificationService,
        'showConfirmation'
      );
      component.deleteProduct(mockProduct);
      expect(spyShowConfirmation).toHaveBeenCalledWith(mockProduct);
      expect(component.selectedDropdownIndex).toBeNull();
    });

    it('debería editar un producto', () => {
      const mockProduct = {
        id: '1',
        name: 'Producto 1',
        description: '',
        releaseDate: new Date(),
        revisionDate: new Date(),
        logoUrl: '',
      };
      const spyChangeProduct = jest.spyOn(
        mockFinancialProductsService,
        'changeProduct'
      );
      const spyNavigate = jest.spyOn(mockRouter, 'navigate');
      component.editProduct(mockProduct);
      expect(spyChangeProduct).toHaveBeenCalledWith(mockProduct);
      expect(spyNavigate).toHaveBeenCalledWith(['/product-registration']);
      expect(component.selectedDropdownIndex).toBeNull();
    });

    it('debería alternar el dropdown', () => {
      component.toggleDropdown(1);
      expect(component.selectedDropdownIndex).toBe(1);
      component.toggleDropdown(1);
      expect(component.selectedDropdownIndex).toBeNull();
    });
  });
});
