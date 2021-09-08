import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoriesService } from '@ang-store/products';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';

import {CardModule} from 'primeng/card';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {MessageService, ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ColorPickerModule} from 'primeng/colorpicker';

const UX_MODULE = [CardModule, ToolbarModule, ButtonModule, TableModule, InputTextModule, ToastModule, ConfirmDialogModule, ColorPickerModule];

// Set up route for component
const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'categories',
                component: CategoriesListComponent,
            },
            {
                path: 'categories/form',
                component: CategoriesFormComponent,
            },
            {
                path: 'categories/form/:id',
                component: CategoriesFormComponent,
            }
        ],
    },
];

@NgModule({
    declarations: [AppComponent, DashboardComponent, ShellComponent, SidebarComponent, CategoriesListComponent, CategoriesFormComponent],
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }), ...UX_MODULE,],
    providers: [CategoriesService, MessageService, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule {}
