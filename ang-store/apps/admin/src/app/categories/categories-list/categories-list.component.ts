import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@ang-store/products';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService, private messageService: MessageService) { }

  ngOnInit(): void {
    this._getCategories()
  }

  deleteCategory(categoryId : string) {
    this.categoriesService.deleteCategory(categoryId).subscribe(_response => {
      // refresh 
      this._getCategories()
      this.messageService.add({severity:'success', summary:'Success', detail:'Category deleted!'});
    }, 
    (_error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Category was not deleted!'});
    })
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }
}
