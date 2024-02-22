import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LimitToDirective } from './limit-to.directive';
import { SearchInputDirective } from './search-input.directive';
import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { LazyLoadDirective } from './lazy-load.directive';
import { DefaultImageDirective } from './default-image.directive';
import { AllowTwoDecimalNumbersDirective } from './allow-two-decimal-numbers.directive';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';
import { MoveCursorAtEndDirective } from './move-cursor-at-end.directive';

@NgModule({
  declarations: [
    LimitToDirective,
    SearchInputDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    DefaultImageDirective,
    AllowTwoDecimalNumbersDirective,
    CopyToClipboardDirective,
    MoveCursorAtEndDirective
  ],
  exports: [
    LimitToDirective,
    SearchInputDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    DefaultImageDirective,
    AllowTwoDecimalNumbersDirective,
    CopyToClipboardDirective,
    MoveCursorAtEndDirective

  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule {
}
