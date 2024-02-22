import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Outlet  } from '../../modules/admin-panel/outlets/model/outlet';
import { VendorDetail } from 'src/app/modules/admin-panel/outlet-details/vendor-details/model/vendor-detail';
import { AddonGroup, Category } from 'src/app/modules/admin-panel/outlet-details/menu/model/menu';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints, Services } from '../models/constants/constant.type';
import { SharedService } from './shared.service';
import { MasterCategory } from 'src/app/modules/data-dump/grocery-master-category/modal/master-category';

@Injectable({
  providedIn: 'root'
})
export class OutletsService {

  categoryList$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(null);
  addonGroupList$: BehaviorSubject<AddonGroup[]> = new BehaviorSubject<AddonGroup[]>(null);
  masterCategoryList$: BehaviorSubject<MasterCategory[]> = new BehaviorSubject<MasterCategory[]>(null);
  outletDetails: Outlet;
  vendorDetail: VendorDetail;
  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }
  /**
   * Method that gets all active,disabled outlets data
   * @param data 
   * @returns 
   */
  getAllOutlets(data: any): Observable<any> {
    return this.http.post(apiUrls.postOutletsFilterEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
   * Method that get outlet details by id
   * @param id 
   * @returns 
   */
  getOutletDetails(id: string): Observable<any> {
    return this.http.get(apiUrls.getOutletDetailsEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        this.outletDetails = Outlet.fromJson(response['result'], this.service);
        return response
      })
    )
  }

  /**
   * Method that put outlet in a holiday slot
   * @param outletId 
   * @param data 
   * @returns 
   */
  postOutletHolidaySlot(outletId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postOutletHolidaySlotEndPoint(outletId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes outlet holiday slot
   * @param outletId 
   * @returns 
   */
  deleteOutletHolidaySlot(outletId: string): Observable<any> {
    return this.http.delete(apiUrls.deleteOutletHolidaySlotEndPoint(outletId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets holiday slot details of outlet
   * @param outletId 
   * @returns 
   */
  getOutletHolidaySlots(outletId: string): Observable<any> {
    return this.http.get(apiUrls.getOutletHolidaySlotsEndPpoint(outletId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets outlet time slots
   * @param outletId 
   * @param data 
   * @returns 
   */
  getOutletTimeSlot(outletId: string): Observable<any> {
    return this.http.get(apiUrls.getOutletTimeSlotEndPoint(outletId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates outlet time slots
   * @param outletId 
   * @param data 
   * @returns 
   */
  updateOutletTimeSlot(outletId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putOutletTimeSlotEndPoint(outletId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that enable or disable outlet
   * @param outletId 
   * @param data 
   * @returns 
   */
  updateOutletStatus(outletId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putOutletStatusEndPoint(outletId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets menu of outlet
   * @returns api response
   */
  getMenu(outletId: string): Observable<any> {
    return this.http.get(apiUrls.getMenuByOutletIdEndPoint(outletId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

/**
 * Method that get Master Category 
 * @returns api response
 */
  getMasterCategory(): Observable<any> {
    return this.http.get(apiUrls.getMasterCategoryForMenuEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        const data: MasterCategory[] = [];
        for ( const i of response['result']) {
          data.push(MasterCategory.fromJson(i))
        }
        this.masterCategoryList$.next(data);
        return response;
      })
    )
  }

  /**
   * Method that gets All Main Categories of outlet and stores it in a observable
   */
  getMainCategories(outletId: string): Observable<any> {
    let params = new HttpParams();
    if (this.service === Services.Food) {
      params = params.append('restaurant_id', outletId);
    } else if (this.service === Services.Grocery) {
      params = params.append('store_id', outletId);
    } else if (this.service === Services.Paan || this.service === Services.Flower || this.service === Services.Pharmacy || this.service === Services.Pet){
      params = params.append('outlet_id', outletId);
    }

    return this.http.get(apiUrls.getMainCategoriesEndPoint(apiEndPoints[this.service]), { params }).pipe(
      map((response) => {
        const data: Category[] = []
        for (const i of response['result']) {
          data.push(Category.fromJson(i));
        }
        this.categoryList$.next(data)
      })
    );
  }

  /**
   * Method that adds category 
   * @param data 
   * @returns 
   */
  addMainCategory(data: any): Observable<any> {
    return this.http.post(apiUrls.postMainCategoryEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that edits category
   * @param id 
   * @param data 
   * @returns 
   */
  editMainCategory(id: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putMainCategoryEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes category
   * @param id 
   * @returns 
   */
  deleteMainCategory(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteMainCategoryEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that adds category to holiday slots
   * @param id 
   * @param data 
   * @returns 
   */
  addMainCategoryHolidaySlot(id: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postMainCategoryHolidaySlotEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that gets All Sub-Categories based on category id
 * @param categoryId 
 * @returns 
 */
  getSubCategories(categoryId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('main_category_id', categoryId.toString());
    return this.http.get(apiUrls.getSubCategoriesByCategoryIdEndPoint(apiEndPoints[this.service]), { params }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
  * Method that adds sub-category in category of outlet menu
  * @param data 
  * @returns 
  */
  addSubCategory(data: any): Observable<any> {
    return this.http.post(apiUrls.postSubCategoryEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that edits sub-category in category of outlet menu
   * @param id 
   * @param data 
   * @returns 
   */
  editSubCategory(subCategoryId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putSubCategoryEndPoint(subCategoryId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that deletes sub-category in category of outlet menu
   * @param subCategoryId 
   * @returns 
   */
  deleteSubCategory(subCategoryId: number): Observable<any> {
    return this.http.delete(apiUrls.deleteSubCategoryEndPoint(subCategoryId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that adds sub category to holiday slots
   * @param id 
   * @param data 
   * @returns 
   */
  addSubCategoryHolidaySlot(id: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postSubCategoryHolidaySlotEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that gets all the Items based on item id
 * @param itemId 
 * @returns 
 */
  getItem(itemId: number): Observable<any> {
    return this.http.get(apiUrls.getItemByIdEndPoint(itemId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
* Method that adds items of outlet menu
* @param data 
* @returns 
*/
  addItem(data: any): Observable<any> {
    return this.http.post(apiUrls.postItemEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
  * Method that edits items of outlet menu
  * @param itemId 
  * @param data 
  * @returns 
  */
  editItem(itemId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putItemEndPoint(itemId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that deletes items of outlet menu
   * @param itemId 
   * @returns 
   */
  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(apiUrls.deleteItemEndPoint(itemId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that adds item to holiday slots
   * @param id 
   * @param data 
   * @returns 
   */
  addItemHolidaySlot(id: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postItemHolidaySlotEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
 * Method that gets all addon groups of this outlet and stores it in a observable
 * @returns Api response
 */
  getAddonGroups(outletId: string): Observable<any> {
    let params = new HttpParams();
    if (this.service === Services.Food) {
      params = params.append('restaurant_id', outletId);
    } else if (this.service === Services.Grocery) {
      params = params.append('store_id', outletId);
    } else if (this.service === Services.Paan || this.service === Services.Flower || this.service === Services.Pharmacy || this.service === Services.Pet){
      params = params.append('outlet_id', outletId);
    }
    return this.http.get(apiUrls.getAddonGroupListEndPoint(apiEndPoints[this.service]), { params }).pipe(
      map((response) => {
        const data: AddonGroup[] = []
        for (const i of response['result']) {
          data.push(AddonGroup.fromJson(i));
        }
        this.addonGroupList$.next(data);
      })
    );
  }

  /**
   * Method that adds addon group to the restaurant
   * @param data 
   * @returns Api response
   */
  addAddonGroup(data: object): Observable<any> {
    return this.http.post(apiUrls.postAddonGroupEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that edits addon group based on id
   * @param id 
   * @param data 
   * @returns Api response
   */
  editAddonGroup(id: number, data: object): Observable<any> {
    return this.http.put(apiUrls.putAddonGroupEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that delets addon group based on id 
   * @param id 
   * @returns Api response
   */
  deleteAddonGroup(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteAddonGroupEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
 * Method that adds Addon-Group to holiday slots
 * @param id 
 * @param data 
 * @returns 
 */
  addAddonGroupHolidaySlot(id: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postAddonGroupHolidaySlotEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that get all addons by addon-group id
   * @param addonGroupId 
   * @returns Api response
   */
  getAddonByAddonGroupId(addonGroupId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('addon_group_id', addonGroupId.toString())
    return this.http.get(apiUrls.getAddonByAddonGroupIdEndPoint(apiEndPoints[this.service]), { params }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that add addon to addon-group
   * @param data 
   * @returns Api response
   */
  addAddon(data: object): Observable<any> {
    return this.http.post(apiUrls.postAddonEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that edits add on
   * @param id 
   * @param data 
   * @returns Api response
   */
  editAddon(id: number, data: object): Observable<any> {
    return this.http.put(apiUrls.putAddonEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that deletes add on
   * @param id 
   * @returns Api response
   */
  deleteAddon(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteAddonEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
* Method that adds Addon to holiday slots
* @param id 
* @param data 
* @returns 
*/
  addAddonHolidaySlot(id: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postAddonHolidaySlotEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
  * Method that gets file upload url to upload file
  * @param file 
  * @returns response
  */
  public getFileUploadUrl(fileExtn): Observable<any> {
    return this.http.get(apiUrls.getFileUploadUrlEndPoint(fileExtn)).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that upload file to aws-s3 bucket
   * @param uploadUrl 
   * @param file 
   * @returns 
   */
  public uploadFile(uploadUrl, file): Observable<any> {
    const headers = new HttpHeaders(
      {
        ignore_headers: 'true',
      },
    )
    return this.http.put(uploadUrl, file, { headers }).pipe(
      map(response => {
        return response
      })
    )
  }

  // catalog approval api
  catalogApproval(restaurantId): Observable<any> {
    return this.http.post(apiUrls.postCatalogApprovalEndPoint(restaurantId, apiEndPoints[this.service]), {}).pipe(
      map(response => {
        return response
      })
    )
  }

  /**
   * Method that gets sales report of outlet
   * @param outletId 
   * @param data 
   * @returns 
   */
  filterOutletSalesReport(outletId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterSalesReportEndPoint(outletId, apiEndPoints[this.service]), data).pipe(
      map(response => {
        return response
      })
    )
  }

  /**
   * Method that updates outlet details like image and prep time
   * @param data
   * @returns
   */
  updateOutletDetails(data: any, id: string): Observable<any> {
    return this.http
      .put(apiUrls.putOutletDetailsEndPoint(id, apiEndPoints[this.service]), data)
      .pipe(
        map((response) => {
          this.outletDetails = Outlet.fromJson(response['result'], this.service);
          return response;
        })
      );
  }

  /**
   * Method that provide details about vendor login Details
   * @param data 
   * @param id 
   * @returns response
   */
  vendorLoginDetails(id: string): Observable<any> {
    return this.http.get(apiUrls.getVendorLoginDetailsByIdEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that updates value of global var
 * @param key 
 * @param data 
 * @returns 
 */
  getGlobalVarByKey(key: string): Observable<any> {
    return this.http.get(apiUrls.putGlobalVarByKeyEndPoint(key, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that reset vendor password
   * @param data 
   * @returns response
   */
  setVendorPassword(data: any): Observable<any> {
    return this.http.post(apiUrls.postVendorSetPasswordEndPoint,data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that change main category sequence
   * @param id 
   * @param data 
   * @returns response
   */
  putMainCategorySequence(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putMainCategorySequenceEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }

  /**
   * Method that change sub category sequence
   * @param categoryId 
   * @param data 
   * @returns response
   */
  putSubCategorySequence(categoryId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putSubcategorySequenceEndPoint(categoryId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }

  /**
   * Method that change menu item sequence
   * @param subCategoryId 
   * @param data 
   * @returns response
   */
  putMenuItemSequence(subCategoryId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putMenuItemSequenceEndPoint(subCategoryId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }

  /**
   * Method that change variant group sequence
   * @param itemId 
   * @param data 
   * @returns response
   */
  putVariantGroupSequence(itemId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putVariantGroupSequenceEndPoint(itemId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }

  /**
   * Method that change variant sequence
   * @param variantGroupId 
   * @param data 
   * @returns response
   */
  putVariantSequence(variantGroupId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putVariantSequenceEndPoint(variantGroupId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }

  /**
   * Method that provide child restaurant detial
   * @param parentId 
   * @returns response
   */
  getChildRestaurant(parentId: string): Observable<any> {
    return this.http.get(apiUrls.getChildRestaurantEndPoint(parentId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }

  /**
   * Method that make oultet as child restaurant
   * @param childId 
   * @param data 
   * @returns response
   */
  putChildRestaurant(childId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putChildRestaurantEndPoint(childId,apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  getParentRestaurant(childId: string): Observable<any> {
    return this.http.get(apiUrls.getParentRestaurantEndPoint(childId,apiEndPoints[this.service])).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }
  
  /**
   * Method that delete child restaurant
   * @param childId 
   * @returns 
   */
  deleteChildRestaurant(childId: string): Observable<any> {
    return this.http.delete(apiUrls.deleteChildRestaurantEndPoint(childId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }
  
 /**
 * Sends a PUT request to update the discount rate for a given outlet.
 * @param id - The ID of the outlet to update.
 * @param data - The data containing the updated discount rate.
 * @returns An Observable that resolves to the response from the server.
 */
  putDiscountRate(id: string, data: any): Observable<any> {
    return this.http.put(
      apiUrls.putDiscountRateEndPoint(id, apiEndPoints[this.service]),
      data
    ).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  postCustomerReview(data: any): Observable<any> {
    return this.http.post(apiUrls.postCustomerReviewEndPoint(apiEndPoints[this.service]),data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates speedyy charges on outlet by id
   * @param id 
   * @param data 
   * @returns 
   */
  putSpeedyyChargesOnOutlet(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putSpeedyyChargesByOutletId(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Download an outlet CSV file by sending a POST request to the API.
 * @param data - The data used to filter and customize the CSV content.
 * @returns An Observable that resolves with the downloaded CSV file as text.
 */
  downloadOutletCsvFile( data: any): Observable<any> {
    return this.http.post(apiUrls.postOutletsFilterEndPoint(apiEndPoints[this.service]), data, { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that save delivery splitting for particular outlet
   * @param id 
   * @param data 
   * @returns 
   */  
  putDeliverySplittingOnOutlet(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putDeliverySplittingByOutletId(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Deletes multiple add-ons in bulk based on the provided data.
 */
  deleteBulkAddons(data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data
    };
    return this.http.delete(apiUrls.bulkDeleteAddons(apiEndPoints[this.service]), options).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Deletes multiple add-on groups in bulk based on the provided data.
 */
  deleteBulkAddonsGroup(data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data
    };
    return this.http.delete(apiUrls.bulkDeleteAddonsGroupEndPoint(apiEndPoints[this.service]), options).pipe(
      map((response) => {
        return response;
      })
    )
  }

    /**
   * Method that copies menu item images
   * @param outletId 
   * @param data 
   * @returns 
   */
    copyMenuItemImages(outletId: string, data: any): Observable<any> {
      return this.http.put(apiUrls.putCopyItemImages(apiEndPoints[this.service],outletId), data).pipe(
        map((response) => {
          return response;
        })
      )
    }
  
  /**
   * Method that show merchant details
   * @param data 
   * @returns response
   */
  postPndMerchant(data: any): Observable<any> {
    return this.http.post(apiUrls.postPndMerchantEndPoint(apiEndPoints[this.service]),data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that approve kyc for merchant
   * @param merchantId 
   * @param data 
   * @returns response
   */
  postMerchantKycApprove(merchantId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postMerchantKycApproveEndPoint(apiEndPoints[this.service],merchantId),data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Mtehod that update merchant details
   * @param merchantId 
   * @param data 
   * @returns response
   */
  putUpdateMerchant(merchantId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putUpdateMerchantEndPoint(apiEndPoints[this.service],merchantId),data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}