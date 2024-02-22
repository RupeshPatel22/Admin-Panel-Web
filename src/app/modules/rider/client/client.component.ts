import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Client, ClientAction, DeliveryCharges, SlabRateType } from './model/client';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  globalFilter: string;
  clientsList: MatTableDataSource<Client> = new MatTableDataSource();
  displayedColumns: string[] = ['clientId', 'clientName', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  showClientActionModal: boolean;
  modalHeading: string;
  modalAction: ClientAction;
  currentClientId: string;
  readonly clientAction = ClientAction;
  readonly slabRateType= SlabRateType;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clientForm = new FormGroup({
    clientId: new FormControl('', [Validators.required]),
    clientName: new FormControl('', [Validators.required]),
    normal: new FormArray([]),
  })
  authToken = new FormControl('', [Validators.required]);
  callbackToken = new FormControl('', [Validators.required]);
  orderStatusCbUrl = new FormControl('', [Validators.required]);
  orderStatusCbMethod = new FormControl('', [Validators.required]);
  riderLocationCbUrl = new FormControl('', [Validators.required]);
  riderLocationCbMethod = new FormControl('', [Validators.required]);
  constructor(private riderService: RiderService, private toastmsgService: ToastService, private activeRoute: ActivatedRoute) { 
    if (Object.keys(activeRoute.snapshot.queryParams).length) {
      const queryParams = activeRoute.snapshot.queryParams;
      this.globalFilter = queryParams.clientId;
    }
  }
  ngOnInit(): void {
    this.getClientsDetails();
  }
  /**
  * Method that matches string of search bar with table content
  * @param filter
  */
  globalSearch(filter: string) {
    this.globalFilter = filter;
    this.clientsList.filter = this.globalFilter.trim().toLowerCase();
    if (this.clientsList.paginator) {
      this.clientsList.paginator.firstPage();
    }
  }
  /**
   * Method that gets all client details
   */
  getClientsDetails() {
    this.riderService.getClientsDetails().subscribe(res => {
      this.clientsList.data = [];
      for (const i of res['result']) {
        this.clientsList.data.push(Client.fromJson(i));
      }
      this.clientsList.sort = this.sort;
      this.clientsList.paginator = this.paginator;
    })
  }
  /**
   * Method that adds new client
   * @returns 
   */
  submitClientDetails() {
    if (this.clientForm.status === 'INVALID') return this.clientForm.markAllAsTouched();
    if (!this.validateDeliveryCharges()) return;
    const formValues = this.clientForm.getRawValue();
    const deliveryCharges = new DeliveryCharges();
    Object.assign(deliveryCharges, formValues);
    const data = {
      client_id: this.clientForm.get('clientId').value,
      name: this.clientForm.get('clientName').value,
      ...deliveryCharges.toJson(),
    }
    this.riderService.sendClientDetails(data).subscribe(res => {
      this.toastmsgService.showSuccess('New Client Added Successfully');
      this.getClientsDetails();
      this.closeClientActionModal();
    })
  }
  /**
   * Method that updates the pricing of the particular client
   * @returns 
   */
  updateClientPricing() {
    if (this.clientForm.status === 'INVALID') return this.clientForm.markAllAsTouched();
    if (!this.validateDeliveryCharges()) return;
    const formValues = this.clientForm.getRawValue();
    const deliveryCharges = new DeliveryCharges();
    Object.assign(deliveryCharges, formValues);
    const data = {
      ...deliveryCharges.toJson(),
    }
    this.riderService.updateClientPricingDetails(this.currentClientId, data).subscribe(res => {
      this.toastmsgService.showSuccess(`Pricing updated for Client ID: ${this.currentClientId}`);
      this.getClientsDetails();
      this.closeClientActionModal();
    })
  }
  /**
   * Method that generates new auth token for client
   */
  generateAuthToken() {
    this.riderService.putClientAuthToken(this.currentClientId).subscribe(res => {
      this.clientsList.data.filter(c => {
        if (c.clientId === res['result']['id']) {
          c['authToken'] = res['result']['auth_token'];
          this.authToken.setValue(c['authToken']);
          return;
        }
      })
      this.toastmsgService.showSuccess(`Auth Token generated for Client ID: ${this.currentClientId}`);
    })
  }
  /**
   * Method that updates call back token received from client
   * @returns 
   */
  submitCallbackToken() {
    if (this.callbackToken.status === 'INVALID') return this.callbackToken.markAsTouched();
    const data = {
      token: this.callbackToken.value
    }
    this.riderService.putClientCallbackToken(this.currentClientId, data).subscribe(res => {
      this.clientsList.data.filter(c => {
        if (c.clientId === res['result']['id']) {
          c['callbackToken'] = res['result']['callback_token'];
          return;
        }
      })
      this.toastmsgService.showSuccess(`Callback Token updated for Client ID: ${this.currentClientId}`);
      this.closeClientActionModal();
    })
  }
  /**
   * Method that sets order status callback url and method
   * @returns 
   */
  submitOrderStatusCallback() {
    if (this.orderStatusCbUrl.status === 'INVALID' || this.orderStatusCbMethod.status === 'INVALID') {
      this.orderStatusCbUrl.markAsTouched();
      this.orderStatusCbMethod.markAsTouched();
      return;
    }
    const data = {
      url: this.orderStatusCbUrl.value,
      method: this.orderStatusCbMethod.value
    }
    this.riderService.putClientOrderStatusCb(this.currentClientId, data).subscribe(res => {
      this.clientsList.data.filter(c => {
        if (c.clientId === res['result']['id']) {
          c['orderStatusCbUrl'] = res['result']['order_status_cb_url'];
          c['orderStatusCbMethod'] = res['result']['order_status_cb_method'];
          return;
        }
      })
      this.toastmsgService.showSuccess(`Order Status Callback updated for Client ID: ${this.currentClientId}`);
      this.closeClientActionModal();
    })
  }
  /**
   * Methof that sets rider location url and method
   * @returns 
   */
  submitRiderLocationCallback() {
    if (this.riderLocationCbUrl.status === 'INVALID' || this.riderLocationCbMethod.status === 'INVALID') {
      this.riderLocationCbUrl.markAsTouched();
      this.riderLocationCbMethod.markAsTouched();
      return;
    }
    const data = {
      url: this.riderLocationCbUrl.value,
      method: this.riderLocationCbMethod.value
    }
    this.riderService.putClientRiderLocationCb(this.currentClientId, data).subscribe(res => {
      this.clientsList.data.filter(c => {
        if (c.clientId === res['result']['id']) {
          c['riderLocationCbUrl'] = res['result']['rider_location_cb_url'];
          c['riderLocationCbMethod'] = res['result']['rider_location_cb_method'];
          return;
        }
      })
      this.toastmsgService.showSuccess(`Rider Location Callback updated for Client ID: ${this.currentClientId}`);
      this.closeClientActionModal();
    })
  }
  /**
   * Method that determines the action based on on modalAction value
   */
  takeAction() {
    if (this.modalAction === ClientAction.AddClient) this.submitClientDetails();
    else if (this.modalAction === ClientAction.UpdatePricing) this.updateClientPricing();
    else if (this.modalAction === ClientAction.CallbackToken) this.submitCallbackToken();
    else if (this.modalAction === ClientAction.OrderStatusCb) this.submitOrderStatusCallback();
    else if (this.modalAction === ClientAction.RiderLocationCb) this.submitRiderLocationCallback();
  }
  /**
   * Method that sets diff values in clientActionModal and then opens the modal
   * @param action 
   * @param client 
   */
  openClientActionModal(action: ClientAction, client?: Client) {
    this.modalAction = action;
    this.currentClientId = client?.clientId;
    if (action === ClientAction.AddClient) {
      this.modalHeading = 'Add Client';
      this.clientForm.reset();
      this.clientForm.enable();
      this.normalDeliveryChargesArr.clear();
      this.removeLongDistanceDeliveryChargesSlab();
    }
    if (action === ClientAction.ViewPricing) {
      this.modalHeading = 'View Pricing';
      this.clientForm.patchValue({
        clientId: client.clientId,
        clientName: client.clientName,
      })
      this.fillUpDeliveryChargesInForm(client);
      this.clientForm.disable();
    }
    if (action === ClientAction.UpdatePricing) {
      this.modalHeading = 'Update Pricing';
      this.clientForm.patchValue({
        clientId: client.clientId,
        clientName: client.clientName,
      })
      this.fillUpDeliveryChargesInForm(client);
      this.clientForm.get('clientId').disable();
      this.clientForm.get('clientName').disable();
    }
    if (action === ClientAction.GenerateAuthToken) {
      this.modalHeading = 'Generate Auth Token';
      this.generateAuthToken();
    }
    if (action === ClientAction.ViewAuthToken) {
      this.modalHeading = 'View Auth Token';
      this.authToken.setValue(client.authToken);
    }
    if (action === ClientAction.CallbackToken) {
      this.modalHeading = 'Callback Token';
      this.callbackToken.setValue(client.callbackToken);
    }
    if (action === ClientAction.OrderStatusCb) {
      this.modalHeading = 'Order Status Callback';
      this.orderStatusCbUrl.setValue(client.orderStatusCbUrl);
      this.orderStatusCbMethod.setValue(client.orderStatusCbMethod);
    }
    if (action === ClientAction.RiderLocationCb) {
      this.modalHeading = 'Rider Location Callback';
      this.riderLocationCbUrl.setValue(client.riderLocationCbUrl);
      this.riderLocationCbMethod.setValue(client.riderLocationCbMethod);
    }
    this.showClientActionModal = true;
  }
  /**
   * Method that closes the modal
   */
  closeClientActionModal() {
    this.showClientActionModal = false;
  }

  /**
   * Method that fill up delivery charges details in a form
   * @param client 
   */
  fillUpDeliveryChargesInForm(client: Client) {
    this.normalDeliveryChargesArr.clear();
    this.removeLongDistanceDeliveryChargesSlab();
    if (client.deliveryCharges?.normal) {
      client.deliveryCharges.normal.forEach(() => this.addNormalDeliveryChargesSlab());
    }
    if (client.deliveryCharges?.longDistance) {
      this.addLongDistanceDeliveryChargesSlab();
    }
    this.clientForm.patchValue({...client.deliveryCharges})
  }

  get normalDeliveryChargesArr() {
    return this.clientForm.get('normal') as FormArray;
  }

  /**
   * Method that returns fg for normal slab
   * @returns 
   */
  initNormalDeliveryChargesSlab() {
    return new FormGroup({
      minDistance: new FormControl('', [Validators.required]),
      maxDistance: new FormControl(),
      rateType: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required])
    })
  }

  /**
   * adds normal slab
   */
  addNormalDeliveryChargesSlab() {
    this.normalDeliveryChargesArr.push(this.initNormalDeliveryChargesSlab())
  }

  /**
   * removed normal slab from particular index
   * @param index 
   */
  removeNormalDeliveryChargesSlab(index: number) {
    if (this.normalDeliveryChargesArr.length > 1) {
      this.normalDeliveryChargesArr.removeAt(index)
    }
  }

  get longDistanceDeliveryChargesGrp() {
    return this.clientForm.get('longDistance') as FormGroup;
  }

  /**
   * Method that returns fg for long distance DC
   * @returns 
   */
  initLongDistanceSeliveryCharges() {
    return new FormGroup({
      minDistance: new FormControl('', [Validators.required]),
      rateType: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required])
    })
  }

  /**
   * adds long-distance DC
   */
  addLongDistanceDeliveryChargesSlab() {
    this.clientForm.addControl('longDistance', this.initLongDistanceSeliveryCharges());
  }

  /**
   * removes fg for long-distance DC
   */
  removeLongDistanceDeliveryChargesSlab() {
    this.clientForm.removeControl('longDistance');
  }

  /**
   * Method that validates delivery charges slabs
   * @returns 
   */
  validateDeliveryCharges() {
    const formValues: DeliveryCharges = this.clientForm.getRawValue();
    const normalDeliverySlabsLen = formValues.normal.length;
    if (!normalDeliverySlabsLen) {
      this.toastmsgService.showError('Add atleast 1 normal slab');
      return false;
    }
    if (normalDeliverySlabsLen) {
      if (formValues.normal[0].minDistance !== 0) {
        this.toastmsgService.showError('First slab min distance must be 0');
        return false;
      }
      if (formValues.normal[normalDeliverySlabsLen - 1].maxDistance) {
        this.toastmsgService.showError('Last slab max distance is not allowed');
        return false;
      }
      for (let i = 0; i < normalDeliverySlabsLen; i++) {
        const currentSlab = formValues.normal[i];
        const nextSlab = formValues.normal[i + 1];
        if (nextSlab && currentSlab.minDistance > currentSlab.maxDistance) {
          this.toastmsgService.showError(`Slab ${i + 1}: max distance should be greater than min distance`);
          return false;
        }
        if (nextSlab && currentSlab.maxDistance !== nextSlab.minDistance) {
          this.toastmsgService.showError(`Slab ${i + 2} min distance should be equal to slab ${i + 1} max distance`);
          return false;
        }
      }
    }
    if (formValues.longDistance && formValues.longDistance.minDistance < formValues.normal[normalDeliverySlabsLen - 1].minDistance) {
      this.toastmsgService.showError('Long Distance min distance should be greater than last slab min distance');
      return false;
    }
    return true;
  }
}
