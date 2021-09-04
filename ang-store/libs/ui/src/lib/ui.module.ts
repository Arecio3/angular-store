import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import { BannerComponent } from './banner/banner.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
      SliderComponent,
      BannerComponent
    ],
    exports: [
      SliderComponent,
      BannerComponent
    ]
})
export class UiModule {}