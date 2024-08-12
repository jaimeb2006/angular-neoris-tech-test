// financial-products.service.spec.ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FinancialProductsService } from './financial-products.service';
import { FinancialProduct } from '../models/financial-product.model';

describe('FinancialProductsService', () => {
  let service: FinancialProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialProductsService],
    });
    service = TestBed.inject(FinancialProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getFinancialProducts', () => {
    it('should return an Observable<PaginatedFinancialProducts>', () => {
      const dummyProducts = [
        new FinancialProduct(
          '123',
          'Product 1',
          'Description 1',
          new Date(),
          new Date(),
          'logoUrl 1'
        ),
        new FinancialProduct(
          '1234',
          'Product 2',
          'Description 2',
          new Date(),
          new Date(),
          'logoUrl 2'
        ),
      ];

      service.getFinancialProducts().subscribe((products) => {
        expect(products.products.length).toBe(2);
        expect(products).toEqual({ products: dummyProducts, totalRecords: 2 });
      });

      const req = httpMock.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: dummyProducts, totalRecords: 2 });
    });
  });

  describe('checkIfIdExists', () => {
    it('should return true for existing ID', () => {
      const dummyId = '123';
      service.checkIfIdExists(dummyId).subscribe((exists) => {
        expect(exists).toBeTruthy();
      });

      const req = httpMock.expectOne(
        `${service.baseUrl}/verification?id=${dummyId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });

  describe('addAndUpdateFinancialProduct', () => {
    it('should add a new product', () => {
      const newProduct = new FinancialProduct(
        '125',
        'Product 3',
        'Description 3',
        new Date(),
        new Date(),
        'logoUrl 3'
      );

      service
        .addAndUpdateFinancialProduct(newProduct, false)
        .subscribe((product) => {
          expect(product).toEqual(newProduct);
        });

      const req = httpMock.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(newProduct);
    });

    it('should update an existing product', () => {
      const updatedProduct = new FinancialProduct(
        '126',
        'Product 4',
        'Description 4',
        new Date(),
        new Date(),
        'logoUrl 4'
      );

      service
        .addAndUpdateFinancialProduct(updatedProduct, true)
        .subscribe((product) => {
          expect(product).toEqual(updatedProduct);
        });

      const req = httpMock.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedProduct);
    });
  });

  describe('deleteFinancialProduct', () => {
    it('should delete a product successfully', () => {
      const productId = '123';

      service.deleteFinancialProduct(productId).subscribe((response) => {
        expect(response).toEqual('Producto eliminado con éxito');
      });

      const req = httpMock.expectOne(`${service.baseUrl}/?id=${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Producto eliminado con éxito');
    });
  });
});
