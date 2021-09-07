import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@ang-store/products';
import {MessageService} from 'primeng/api';
import { timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  editmode = false;
  currentCategoryID = '';

  constructor(private location: Location, private messageService: MessageService, private formBuilder: FormBuilder, private categoriesService: CategoriesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['', Validators.required],
      icon: ['', Validators.required]
    });

    this._checkEditMode();
  }

  //Grabs form values
  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    const category: Category = {
      id:   this.currentCategoryID,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value
    };

    if(this.editmode) {
      this._updateCategory(category)
    } else {
      this._addCategory(category)
    }
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe(_response => {
      this.messageService.add({severity:'success', summary:'Success', detail:'Woo! Category was created!'});
      timer(1500).toPromise().then(() => {
        this.location.back();
      })
    }, 
    (_error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Category was not created'});
    });
  }
  // Add Category
  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).subscribe(_response => {
      this.messageService.add({severity:'info', summary:'Success', detail:'Category Updated!'});
      timer(1500).toPromise().then(() => {
        this.location.back();
      })
    }, 
    (_error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Category was not updated!'});
    });
  }
  // Check if its on edit mode
  private _checkEditMode() {
    // Checks if URL has the id
    this.route.params.subscribe(params => {
      if(params.id) {
        this.editmode = true;
        this.currentCategoryID = params.id;
        //  Grabs old values with controls
        this.categoriesService.getCategory(params.id).subscribe(category => {
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
        })
      }
    });
  }

  get categoryForm() {
    return this.form.controls;
  }

}
