import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@ang-store/products';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {
    this._getCategories()
  }

  deleteCategory(categoryId : string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to DELETE this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe(_response => {
          // refresh 
          this._getCategories()
          this.messageService.add({severity:'success', summary:'Success', detail:'Category deleted!'});
        }, 
        (_error) => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Category was not deleted!'});
        })
      },
      reject: () => {}
  });
  }

  updateCategory(categoryId : string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }
}
