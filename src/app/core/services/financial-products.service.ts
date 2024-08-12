// financial-products.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  throwError,
} from 'rxjs';
import { FinancialProduct } from '../models/financial-product.model'; // Asegúrate de crear este modelo
import { ApiResponseItem } from '../../shared/api-response-types';

interface PaginatedFinancialProducts {
  products: FinancialProduct[];
  totalRecords: number;
}

@Injectable({
  providedIn: 'root',
})
export class FinancialProductsService {
  public baseUrl =
    'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';
  private authorId = '500'; // Replace with your generated AuthorID

  private productSource = new BehaviorSubject<FinancialProduct | null>(null);
  currentProduct = this.productSource.asObservable();

  constructor(private http: HttpClient) {}

  getFinancialProducts(
    page: number = 1,
    pageSize: number = 5,
    searchTerm: string = ''
  ): Observable<PaginatedFinancialProducts> {
    const headers = new HttpHeaders({
      authorId: this.authorId,
    });
    return this.http.get<ApiResponseItem[]>(this.baseUrl, { headers }).pipe(
      map(FinancialProduct.fromApiResponse),
      map((products) => {
        if (searchTerm) {
          products = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        const totalRecords = products.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedProducts = products.slice(start, end);

        return {
          products: paginatedProducts,
          totalRecords: totalRecords,
        };
      })
    );
  }

  checkIfIdExists(id: string): Observable<boolean> {
    const headers = new HttpHeaders({ authorId: this.authorId });
    const params = new HttpParams().set('id', id);
    const verificationUrl = `${this.baseUrl}/verification`;

    return this.http.get<boolean>(verificationUrl, { headers, params }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error checking if ID exists:', error);
        return of(false); // Asegura que siempre devuelvas un Observable<boolean>
      })
    );
  }

  addAndUpdateFinancialProduct(
    product: FinancialProduct,
    isEditMode: boolean
  ): Observable<FinancialProduct> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorId: this.authorId,
    });

    if (isEditMode) {
      return this.http.put<FinancialProduct>(
        `${this.baseUrl}`,
        FinancialProduct.toDict(product),
        { headers }
      );
    }

    return this.http.post<FinancialProduct>(
      this.baseUrl,
      FinancialProduct.toDict(product),
      { headers }
    );
  }

  deleteFinancialProduct(id: string): Observable<string> {
    console.log(
      '🚀 ~ FinancialProductsService ~ deleteFinancialProduct ~ id:',
      id
    );
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      authorId: this.authorId,
    });

    return this.http.delete(`${this.baseUrl}/?id=${id}`, { headers }).pipe(
      map((response: any) => {
        return 'Producto eliminado con éxito';
      }),
      catchError((error) => {
        if (error.status === 200) {
          return of('Producto eliminado con éxito');
        }
        // Manejo de errores
        return throwError(
          () => new Error('Error al eliminar el producto: ' + error.message)
        );
      })
    );
  }
  changeProduct(product: FinancialProduct | null) {
    this.productSource.next(product);
  }
}
