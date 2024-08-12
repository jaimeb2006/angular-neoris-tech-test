import { Component, ViewContainerRef } from '@angular/core';
import { FinancialProductsService } from '../../core/services/financial-products.service';
import { FinancialProduct } from '../../core/models/financial-product.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  dropdownOpen = false;
  loading = true;
  currentPage: number = 1;
  pageSize: number = 5;
  totalProducts: number = 0;
  totalPages: number = 1;
  pages: number[] = [];

  lista: string[] = ['5', '10', '20'];
  searchTerm: string = '';

  financialProducts: FinancialProduct[] = [];

  selectedDropdownIndex: number | null = null;

  searchControl = new FormControl('');
  registerControl = new FormControl('');

  constructor(
    private financialProductService: FinancialProductsService,
    private router: Router,
    private notificationService: NotificationService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.registerControl.setValue(String(this.pageSize));
    this.currentPage = 1;
    this.totalPages = 1;
    this.setupNumberRecords();
    this.loadFinancialProducts();
    this.setupSearch();
    this.notificationService.setViewContainerRef(this.viewContainerRef);
  }

  setupNumberRecords() {
    this.registerControl.valueChanges
      .pipe(map((numberRecords) => numberRecords ?? '5'))
      .subscribe((numberRecords) => {
        this.pageSize = Number(numberRecords);
        this.loadFinancialProducts();
      });
  }

  loadFinancialProducts(page: number = 1): void {
    this.financialProductService
      .getFinancialProducts(page, this.pageSize, this.searchTerm)
      .subscribe({
        next: ({ products, totalRecords }) => {
          this.financialProducts = products;
          this.totalProducts = totalRecords;
          this.totalPages = Math.ceil(this.totalProducts / 5);
          this.calculateTotalPages();
          this.generatePageNumbers();
          this.loading = false;
        },
        error: (error) => {
          console.error('There was an error!');
          this.loading = false;
          this.financialProducts = [];
        },
      });
  }
  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((searchTerm) => searchTerm ?? '')
      )
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.loadFinancialProducts();
      });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
  }

  generatePageNumbers() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  navigateToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadFinancialProducts(page);
  }
  deleteProduct(producto: FinancialProduct) {
    this.notificationService.showConfirmation(producto);
    this.selectedDropdownIndex = null;
  }
  editProduct(product: FinancialProduct | null) {
    this.selectedDropdownIndex = null;
    this.financialProductService.changeProduct(product);
    this.router.navigate(['/product-registration']);
  }
  toggleDropdown(index: number): void {
    this.selectedDropdownIndex =
      this.selectedDropdownIndex === index ? null : index;
  }
}
