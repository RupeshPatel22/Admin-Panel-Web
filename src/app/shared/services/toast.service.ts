import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastrService: ToastrService) {}

  public showSuccess(message): void {
    this.toastrService.success(message);
  }

  public showInfo(
    message,
    title?: string,
    override?: Partial<IndividualConfig>
  ): void {
    this.toastrService.info(message, title, override);
  }

  public showWarning(message: string, title?: string, override?: Partial<IndividualConfig>): void {
    this.toastrService.warning(message, title, override);
  }

  public showError(message): void {
    this.toastrService.error(message);
  }
}
