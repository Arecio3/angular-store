import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@ang-store/products';
import {MessageService} from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  constructor(private location: Location, private messageService: MessageService, private formBuilder: FormBuilder, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['', Validators.required],
      icon: ['', Validators.required]
    });
  }

  //Grabs form values
  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    const category: Category = {
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value
    };
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

  get categoryForm() {
    return this.form.controls;
  }

}
