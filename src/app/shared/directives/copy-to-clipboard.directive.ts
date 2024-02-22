import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener, Input } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {

  @Input('appCopyToClipboard') textToCopy: string;
  constructor(private clipboard: Clipboard, private toastMsgService: ToastService) { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.clipboard.copy(this.textToCopy);
    this.toastMsgService.showSuccess('Copied to Clipboard');
  }
}
