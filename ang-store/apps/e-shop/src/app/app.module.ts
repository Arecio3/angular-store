import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

// Route Paths
const routes: Routes = [
  // Home
  {path: '', component: HomePageComponent},
  // Product List
  {path: 'products', component: ProductListComponent}
]

@NgModule({
  // All Project Components
  declarations: [AppComponent, HomePageComponent, ProductListComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
