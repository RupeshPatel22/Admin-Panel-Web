import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { JoinPipe } from './join.pipe';
import { TitleizePipe } from './titleize.pipe';
import { SearchPipe } from './search.pipe';
import { FilterUniquePipe } from './filter-unique.pipe';
import { FoodTypeFilterPipe } from './food-type-filter.pipe';
import { AddonGroupFilterPipe } from './addon-group-filter.pipe';
import { CategoryFilterPipe } from './category-filter.pipe';
import { SubCategoryFilterPipe } from './sub-category-filter.pipe';
import { UniqueAddonGroupFilterPipe } from './unique-addon-group-filter.pipe';
import { UniqueRiderOpZoneFilterPipe } from './unique-rider-op-zone-filter.pipe';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    JoinPipe,
    TitleizePipe,
    SearchPipe,
    FilterUniquePipe,
    FoodTypeFilterPipe,
    AddonGroupFilterPipe,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
    UniqueAddonGroupFilterPipe,
    UniqueRiderOpZoneFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SearchPipe,
    FilterUniquePipe,
    FoodTypeFilterPipe,
    AddonGroupFilterPipe,
    CategoryFilterPipe,
    SubCategoryFilterPipe,
    UniqueAddonGroupFilterPipe,
    UniqueRiderOpZoneFilterPipe
  ]
})
export class PipesModule { }
