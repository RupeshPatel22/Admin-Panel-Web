import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMoveCursorAtEnd]'
})
export class MoveCursorAtEndDirective {

  constructor(private element: ElementRef) { }

  /**
 * Move the cursor to the end of the input field with the specified ID.
 * @param id - The ID of the input field.
 * @returns void
 */
@HostListener('mouseenter',['$event'])
 moveCursorToEnd(): void {
  const el = this.element.nativeElement as HTMLInputElement;;
  el.focus();
  el.setSelectionRange(el.value.length, el.value.length);

}

}
