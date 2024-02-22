import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import {
  Addon,
  AddonGroup,
  Category,
  FoodTypes,
  Menu,
  MenuItem,
  SubCategory,
} from './model/menu';
import { OfflineDialogComponent } from '././offline-dialog/offline-dialog.component';
import { AddNewDialogComponent } from './add-new-dialog/add-new-dialog.component';
import { CategoryFilterPipe } from 'src/app/shared/pipes/category-filter.pipe';
import { permissionDeniedErrorMsg, Services } from 'src/app/shared/models/constants/constant.type';
import { Outlet } from '../../outlets/model/outlet';
import { AddonGroupFilterPipe } from 'src/app/shared/pipes/addon-group-filter.pipe';
import { KeyValue } from '@angular/common';
import { posErrorMsg } from 'src/app/shared/models/constants/constant.type';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [CategoryFilterPipe, AddonGroupFilterPipe],
})
export class MenuComponent implements OnInit, OnDestroy {
  openedCategoryPanels = {};
  openedSubCategoryPanels = {};
  openedAddonsPanels = {};
  menuList: Menu[] = [];
  categoryList: Category[] = [];
  addonGroupList: AddonGroup[] = [];
  showAddons: boolean;
  isAddSubCategory: boolean;
  showSubCategoryActionModal: boolean;
  showAddonActionModal: boolean;
  showItemActionModal: boolean;
  itemModalData: any;
  addonModalData: any;
  searchMenu: string;
  subscriptions: Subscription[] = [];
  outletDetails: Outlet;
  foodTypeSelection = '';
  noFilteredData: boolean;
  // discountRate: number;

  displayedColumns = [
    'image',
    'itemId',
    'itemName',
    'itemPrice',
    // 'discountRate',
    'itemType',
    'status',
    'actions',
  ];
  addOnsDisplayedColumns = [
    'checkbox',
    'addonId',
    'addonName',
    'addonPrice',
    'foodType',
    'status',
    'actions',
  ];
  readonly Services = Services;
  service: string;

  subCategoryActionForm = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    subCategoryId: new FormControl({ disabled: true, value: '' }),
    subCategoryName: new FormControl('', [Validators.required]),
    // discountRate: new FormControl('',),

  });

  dummyMenuItemImageUrl: string;
  selectedFoodTypes = Object.keys(FoodTypes);
  selectedFoodTypesInString = JSON.stringify(this.selectedFoodTypes);
  readonly foodTypes = FoodTypes;
  readonly originalOrder = originalOrder;
  isCategorySequenceModalVisible: boolean;
  isSubCategorySequenceModalVisible: boolean;
  isItemsSequenceModalVisible: boolean;
  categoryId: number;
  subCategoryList: SubCategory[];
  subCategoryId: number;
  menuItemList: MenuItem[];
  addOnGroupId: number [];
  selectedAddOnGroups: number[] = [];
  selectedAddOns: any[] = [];
  selectedAddOnsByGroup: { [groupIndex: number]: number[] } = {};
  selectedAddOnsIndeterminate: { [groupIndex: number]: boolean } = {};
  sourceOutletId: string;
  isCopyMenuItemImages: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private outletsService: OutletsService,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
    private categoryFilterPipe: CategoryFilterPipe,
    private addonGroupFilterPipe: AddonGroupFilterPipe,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.service = this.outletsService.service;
    this.outletDetails = this.outletsService.outletDetails;
    this.setMasterCategories();
    this.setMenu();
    this.setMainCategories();
    this.setAddonGroups();
    this.subscriptions.push(
      this.outletsService.categoryList$.subscribe(
        (data) => (this.categoryList = data)
      )
    );
    this.subscriptions.push(
      this.outletsService.addonGroupList$.subscribe(
        (data) => (this.addonGroupList = data)
      )
    );
    this.getDummyMenuItemImage();
  }

  /**
   * Method that sets restaurant menu
   */
  setMenu() {
    this.subscriptions.push(
      this.outletsService.getMenu(this.outletDetails.id).subscribe((res) => {
        this.menuList = [];
        for (const i of res['result']) {
          this.menuList.push(Menu.fromJson(i));
        }
      })
    );
  }

  setMasterCategories() {
    if ( this.service === Services.Grocery || this.service === Services.Pharmacy || this.service === Services.Pet) {
      this.subscriptions.push(this.outletsService.getMasterCategory().subscribe());
    }
  }

  /**
   * Method that makes API call to set all categories of the restaurant
   */
  setMainCategories() {
    this.subscriptions.push(
      this.outletsService.getMainCategories(this.outletDetails.id).subscribe()
    );
  }

  /**
   * Method that makes API call to set addon-groups of the restaurant
   */
  setAddonGroups() {
    this.subscriptions.push(
      this.outletsService.getAddonGroups(this.outletDetails.id).subscribe()
    );
  }

  /**
   * Method that sets addons in addon-group by addonGroupId
   * @param addonGroupId
   * @param index
   */
  setAddons(addonGroupId: number) {
    const index = this.addonGroupList.findIndex(addonGrp => addonGrp.addonGroupId === addonGroupId);
    if (this.addonGroupList[index]['addons'].length === 0) {
      this.subscriptions.push(
        this.outletsService
          .getAddonByAddonGroupId(addonGroupId)
          .subscribe((res) => {
            for (const i of res['result']) {
              this.addonGroupList[index]['addons'].push(Addon.fromJson(i));
            }
          })
      );
    }
  }

  /**
   * Method that adds or edits category/Add on group
   * and then makes API call based on that
   * @param isEdit
   * @param id
   * @param name
   */

  openAddNewDialog(isEdit: boolean, id?: number, name?: string, masterCategoryId?: number ) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);

    const dialogRef = this.dialog.open(AddNewDialogComponent, {
      data: {
        openedFrom: this.showAddons ? 'add-on' : 'category',
        isEdit: isEdit,
        name: isEdit ? name : '',
        masterCategoryId: isEdit ? masterCategoryId: null,
        // discountRate: isEdit ? discountRate :'',
      },
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          name: response.name,
          master_category_id: response.masterCategory,
          sequence: response.sequence,
        };
        if (response.addAction === 'category') {
          if (!isEdit) {
            if (this.outletsService.service === Services.Food) {
              data['restaurant_id'] = this.outletDetails.id; //sending res_id in post API
            } else if (this.outletsService.service === Services.Grocery) {
              data['store_id'] = this.outletDetails.id; //sending store_id in post API
            }else if (this.outletsService.service === Services.Paan || this.outletsService.service === Services.Flower || this.outletsService.service === Services.Pharmacy || this.outletsService.service === Services.Pet) {
              data['outlet_id'] = this.outletDetails.id; //sending outlet_id in post API
            }
            this.subscriptions.push(
              this.outletsService.addMainCategory(data).subscribe((res) => {
                // For Category List
                this.categoryList.push(Category.fromJson(res['result']));
                this.outletsService.categoryList$.next(this.categoryList);

                // For Menu List
                this.menuList.push(Menu.fromJson(res['result']));
                // this.setMenu();
                this.toastMsgService.showSuccess(
                  `Category: ${res['result']['name']} added successfully`
                );
              })
            );
          } else {
            this.subscriptions.push(
              this.outletsService.editMainCategory(id, data).subscribe((res) => {
                // For Category List
                let index = this.categoryList.findIndex(
                  (obj) => obj['categoryId'] === res['result']['id']
                );
                this.categoryList[index]['categoryName'] =
                  res['result']['name'];
                this.outletsService.categoryList$.next(this.categoryList);

                // For Menu List
                index = this.menuList.findIndex(
                  (obj) => obj['categoryId'] === res['result']['id']
                );
                this.menuList[index]['categoryName'] = res['result']['name'];
                this.menuList[index]['masterCategoryName'] = res['result']['master_category_name'];
                // this.setMenu();
                this.toastMsgService.showSuccess(
                  `Category: ${res['result']['name']} updated successfully`
                );
              })
            );
          }
        } else {
          if (!isEdit) {
            if(this.outletsService.service === Services.Food)
            data['restaurant_id'] = this.outletDetails.id; //sending res_id in post API
            if(this.outletsService.service === Services.Grocery)
            data['store_id'] = this.outletDetails.id; //sending res_id in post API
          if(this.outletsService.service === Services.Paan || this.outletsService.service === Services.Flower || this.outletsService.service === Services.Pharmacy || this.outletsService.service === Services.Pet)
          data['outlet_id'] = this.outletDetails.id;
            this.subscriptions.push(
              this.outletsService.addAddonGroup(data).subscribe((res) => {
                this.addonGroupList.push(AddonGroup.fromJson(res['result']));
                this.outletsService.addonGroupList$.next(this.addonGroupList);
                this.toastMsgService.showSuccess(
                  `Addon-Group: ${res['result']['name']} added successfully`
                );
              })
            );
          } else {
            this.subscriptions.push(
              this.outletsService.editAddonGroup(id, data).subscribe((res) => {
                const index = this.addonGroupList.findIndex(
                  (obj) => obj['addonGroupId'] === res['result']['id']
                );
                this.addonGroupList[index]['addonGroupName'] =
                  res['result']['name'];
                this.outletsService.addonGroupList$.next(this.addonGroupList);
                this.toastMsgService.showSuccess(
                  `Addon-Group: ${res['result']['name']} updated successfully`
                );
              })
            );
          }
        }
      }
    });
  }

  /**
   * Method that toggles add new sub category modal
   * @param actionType
   * @param category
   * @param index
   */
  toggleSubCategoryActionModal(
    actionType: string,
    category?: Menu,
    index?: number
  ) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);
    if (actionType === 'ADD') {
      this.isAddSubCategory = true;
      this.subCategoryActionForm.patchValue({
        categoryId: category.categoryId,
        subCategoryId: '',
        subCategoryName: '',
      });
    } else if (actionType === 'EDIT') {
      this.isAddSubCategory = false;
      this.subCategoryActionForm.patchValue({
        categoryId: category.categoryId,
        subCategoryId: category.subCategories[index]['subCategoryId'],
        subCategoryName: category.subCategories[index]['subCategoryName'],
        // discountRate: category.subCategories[index]['discountRate']
      });
    }
    this.showSubCategoryActionModal = !this.showSubCategoryActionModal;
  }

  /**
   * Methods that adds/edits sub category
   */
  submitSubCategory() {
    if (this.subCategoryActionForm.status === 'INVALID') {
      this.subCategoryActionForm.markAllAsTouched();
      return;
    }
    const data = {
      main_category_id:
        this.subCategoryActionForm['controls']['categoryId'].value,
      name: this.subCategoryActionForm['controls']['subCategoryName'].value,
    };
    if (this.isAddSubCategory) {
      this.subscriptions.push(
        this.outletsService.addSubCategory(data).subscribe((res) => {
          this.setMenu();
          this.toggleSubCategoryActionModal('');
          this.toastMsgService.showSuccess(
            `Sub-Category: ${res['result']['name']} added successfully`
          );
        })
      );
    } else {
      const subCategoryId =
        this.subCategoryActionForm['controls']['subCategoryId'].value;
      this.subscriptions.push(
        this.outletsService
          .editSubCategory(subCategoryId, data)
          .subscribe((res) => {
            this.setMenu();
            this.toggleSubCategoryActionModal('');
            this.toastMsgService.showSuccess(
              `Sub-Category: ${res['result']['name']} updated successfully`
            );
          })
      );
    }
  }

  /**
   * Method that toggles add-new-item-modal
   * @param actionType
   * @param categoryId
   * @param subCategoryId
   * @param itemId
   */
  toggleItemActionModal(
    actionType: string,
    categoryId?: number,
    subCategoryId?: number,
    itemId?: number
  ) {
    if (!this.sharedService.hasEditAccessForOutletDetails && (actionType === 'ADD' || actionType === 'EDIT')) {
      return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    } 
    if (this.outletDetails.posId && (actionType === 'ADD')) {
      return this.toastMsgService.showInfo(posErrorMsg);
    }
    this.itemModalData = {
      actionType: actionType,
      outletId: this.outletDetails.id,
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      itemId: itemId,
      disableAll: actionType === 'VIEW' ? true : false,
    }
    if (actionType === 'close') {
      this.setMenu();
    }
    this.showItemActionModal = !this.showItemActionModal;
  }

  /**
   * Method that navigates to the add new add on form page.
   */
  toggleAddonActionModal(
    actionType: string,
    addonGroupId?: string,
    addon?: Addon
  ) {
    if (!this.sharedService.hasEditAccessForOutletDetails && (actionType === 'ADD' || actionType === 'EDIT')) {
      return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    } 
    if (this.outletDetails.posId && (actionType === 'ADD' || actionType === 'EDIT')) {
      return this.toastMsgService.showInfo(posErrorMsg);
    }
    this.addonModalData = {
      actionType: actionType,
      addonGroupId: addonGroupId,
      addon: addon,
      disableAll: actionType === 'VIEW' ? true : false,
    }
    if (actionType === 'close') {
      this.setAddonGroups();
    }
    this.showAddonActionModal = !this.showAddonActionModal;
  }

  /**
   * Method that deletes category/sub-category/item/addon-group/add-on
   * @param term
   * @param id
   */
  removeAction(term: string, id: number, name: string) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        confirmBtnText: 'remove',
        dismissBtnText: 'not now',
        message: `Do you want to remove the ${term}, ${name} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        if (term === 'category') {
          this.subscriptions.push(
            this.outletsService.deleteMainCategory(id).subscribe((res) => {
              // For Category List
              let index = this.categoryList.findIndex(
                (obj) => obj['categoryId'] === res['result']['id']
              );
              this.categoryList.splice(index, 1);
              this.outletsService.categoryList$.next(this.categoryList);

              // For Menu List
              index = this.menuList.findIndex(
                (obj) => obj['categoryId'] === res['result']['id']
              );
              this.menuList.splice(index, 1);
              // this.setMenu();
              this.toastMsgService.showSuccess(
                `Category: ${name} deleted successfully`
              );
            })
          );
        } else if (term === 'sub-category') {
          this.subscriptions.push(
            this.outletsService.deleteSubCategory(id).subscribe((res) => {
              this.setMenu();
              this.toastMsgService.showSuccess(
                `Sub-Category: ${name} deleted successfully`
              );
            })
          );
        } else if (term === 'item') {
          this.subscriptions.push(
            this.outletsService.deleteItem(id).subscribe((res) => {
              this.setMenu();
              this.toastMsgService.showSuccess(
                `Item: ${name} deleted successfully`
              );
            })
          );
        } else if (term === 'addon-group') {
          this.subscriptions.push(
            this.outletsService.deleteAddonGroup(id).subscribe((res) => {
              const index = this.addonGroupList.findIndex(
                (obj) => obj['addonGroupId'] === res['result']['id']
              );
              this.addonGroupList.splice(index, 1);
              this.outletsService.addonGroupList$.next(this.addonGroupList);
              this.toastMsgService.showSuccess(
                `Addon-Group: ${name} deleted successfully`
              );
            })
          );
        } else if (term === 'addon') {
          this.subscriptions.push(
            this.outletsService.deleteAddon(id).subscribe((res) => {
              this.setAddonGroups();
              this.toastMsgService.showSuccess(
                `Addon: ${name} deleted successfully`
              );
            })
          );
        }
      }
    });
  }

  /**
   * Method that create holiday slots for category
   * @param category
   */
  createCategoryHolidaySlot(category: Menu) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);

    let hasItems: boolean = false;
    for (const i of category.subCategories) {
      if (i['menuItems'].length > 0) {
        hasItems = true;
        break;
      }
    }
    if (!hasItems) {
      this.toastMsgService.showInfo('This category has no items');
      return;
    }
    if (category.categoryInStock) {
      const dialogRef = this.dialog.open(OfflineDialogComponent, {
        data: { openedFor: 'category' },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response.flag) {
          const data = { end_epoch: response.endDate };
          this.subscriptions.push(
            this.outletsService
              .addMainCategoryHolidaySlot(category.categoryId, data)
              .subscribe((res) => {
                category.categoryInStock = false;
                category.subCategories.forEach((sub) => {
                  sub.subCategoryInStock = false;
                  sub.menuItems.forEach((item) => {
                    item.itemInStock = false;
                  });
                });
                this.toastMsgService.showSuccess(
                  `${category.categoryName} added to holiday slot`
                );
              })
          );
        }
      });
    } else {
      const data = { end_epoch: null };
      this.subscriptions.push(
        this.outletsService
          .addMainCategoryHolidaySlot(category.categoryId, data)
          .subscribe((res) => {
            category.categoryInStock = true;
            category.subCategories.forEach((sub) => {
              sub.subCategoryInStock = true;
              sub.menuItems.forEach((item) => {
                item.itemInStock = true;
              });
            });
            this.toastMsgService.showSuccess(
              `${category.categoryName} removed from holiday slot`
            );
          })
      );
    }
  }

  /**
   *  Method that create holiday slots for subCategory
   * @param subCategory
   * @param category
   */
  createSubCategoryHolidaySlot(subCategory: SubCategory, category: Menu) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);

    if (subCategory.menuItems.length === 0) {
      this.toastMsgService.showInfo('This sub-category has no items');
      return;
    }
    if (subCategory.subCategoryInStock) {
      const dialogRef = this.dialog.open(OfflineDialogComponent, {
        data: { openedFor: 'sub-category' },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response.flag) {
          const data = { end_epoch: response.endDate };
          this.subscriptions.push(
            this.outletsService
              .addSubCategoryHolidaySlot(subCategory.subCategoryId, data)
              .subscribe((res) => {
                subCategory.subCategoryInStock = false;
                subCategory.menuItems.forEach((item) => {
                  item.itemInStock = false;
                });
                let count = 0;
                category.subCategories.forEach((sub) => {
                  if (!sub.subCategoryInStock) {
                    count++;
                  }
                });
                if (category.subCategories.length === count) {
                  category.categoryInStock = false;
                }
                this.toastMsgService.showSuccess(
                  `${subCategory.subCategoryName} added to holiday slot`
                );
              })
          );
        }
      });
    } else {
      const data = { end_epoch: null };
      this.subscriptions.push(
        this.outletsService
          .addSubCategoryHolidaySlot(subCategory.subCategoryId, data)
          .subscribe((res) => {
            subCategory.subCategoryInStock = true;
            subCategory.menuItems.forEach((item) => {
              item.itemInStock = true;
            });
            category.categoryInStock = true;
            this.toastMsgService.showSuccess(
              `${subCategory.subCategoryName} removed from holiday slot`
            );
          })
      );
    }
  }

  /**
   *  Method that create holiday slots for item
   * @param item
   * @param subCategory
   * @param category
   */
  createItemHolidaySlot(
    item: MenuItem,
    subCategory: SubCategory,
    category: Menu
  ) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);
    
    if (item.itemInStock) {
      const dialogRef = this.dialog.open(OfflineDialogComponent, {
        data: { openedFor: 'item' },
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response.flag) {
          const data = { end_epoch: response.endDate };
          this.subscriptions.push(
            this.outletsService
              .addItemHolidaySlot(item.itemId, data)
              .subscribe((res) => {
                item.itemInStock = false;

                let count = 0;
                subCategory.menuItems.forEach((menuItem) => {
                  if (!menuItem.itemInStock) {
                    count++;
                  }
                });
                if (subCategory.menuItems.length === count) {
                  subCategory.subCategoryInStock = false;
                }

                count = 0;
                category.subCategories.forEach((sub) => {
                  if (!sub.subCategoryInStock) {
                    count++;
                  }
                });
                if (category.subCategories.length === count) {
                  category.categoryInStock = false;
                }
                this.toastMsgService.showSuccess(
                  `${item.itemName} added to holiday slot`
                );
              })
          );
        }
      });
    } else {
      const data = { end_epoch: null };
      this.subscriptions.push(
        this.outletsService
          .addItemHolidaySlot(item.itemId, data)
          .subscribe((res) => {
            item.itemInStock = true;
            subCategory.subCategoryInStock = true;
            category.categoryInStock = true;
            this.toastMsgService.showSuccess(
              `${item.itemName} removed from holiday slot`
            );
          })
      );
    }
  }

  /**
   * Method that add/remove holiday slots for addongroup
   * @param addonGroup
   */
  createAddonGroupHolidaySlot(addonGroup: AddonGroup) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);

    if (addonGroup.addonGroupInStock) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure ?',
          message: `Do you want to add ${addonGroup.addonGroupName} in holiday slot ?`,
          confirmBtnText: 'Yes',
          dismissBtnText: 'not now',
        },
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response) {
          const data = { in_stock: false };
          this.subscriptions.push(
            this.outletsService
              .addAddonGroupHolidaySlot(addonGroup.addonGroupId, data)
              .subscribe((res) => {
                addonGroup.addonGroupInStock = false;
                addonGroup.addons.forEach((addon) => {
                  addon.addonInStock = false;
                });
                this.toastMsgService.showSuccess(
                  `${addonGroup.addonGroupName} added to holiday slot`
                );
              })
          );
        }
      });
    } else {
      const data = { in_stock: true };
      this.subscriptions.push(
        this.outletsService
          .addAddonGroupHolidaySlot(addonGroup.addonGroupId, data)
          .subscribe((res) => {
            addonGroup.addonGroupInStock = true;
            addonGroup.addons.forEach((addon) => {
              addon.addonInStock = true;
            });
            this.toastMsgService.showSuccess(
              `${addonGroup.addonGroupName} removed from holiday slot`
            );
          })
      );
    }
  }

  /**
   * Method that add/remove holiday slots for addon
   * @param addon
   * @param addonGroup
   */
  createAddonHolidaySlot(addon: Addon, addonGroup: AddonGroup) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    if (this.outletDetails.posId) return this.toastMsgService.showInfo(posErrorMsg);
    if (addon.addonInStock) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure ?',
          message: `Do you want to add ${addon.addonName} in holiday slot ?`,
          confirmBtnText: 'Yes',
          dismissBtnText: 'not now',
        },
      });
      dialogRef.afterClosed().subscribe((response) => {
        if (response) {
          const data = { in_stock: false };
          this.subscriptions.push(
            this.outletsService
              .addAddonHolidaySlot(addon.addonId, data)
              .subscribe((res) => {
                addon.addonInStock = false;
                let count = 0;
                addonGroup.addons.forEach((addon) => {
                  if (!addon.addonInStock) {
                    count++;
                  }
                });
                if (addonGroup.addons.length === count) {
                  addonGroup.addonGroupInStock = false;
                }
                this.toastMsgService.showSuccess(
                  `${addon.addonName} added to holiday slot`
                );
              })
          );
        }
      });
    } else {
      const data = { in_stock: true };
      this.subscriptions.push(
        this.outletsService
          .addAddonHolidaySlot(addon.addonId, data)
          .subscribe((res) => {
            addon.addonInStock = true;
            addonGroup.addonGroupInStock = true;
            this.toastMsgService.showSuccess(
              `${addon.addonName} removed from holiday slot`
            );
          })
      );
    }
  }

  preventUncheckingAllFoodTypeCheckboxes(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.checked && this.selectedFoodTypes.length <= 1) return event.preventDefault();
  }

  onFoodTypeSelectionChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.checked) {
      this.selectedFoodTypes.push(target.value);
    } else {
      this.selectedFoodTypes.splice(this.selectedFoodTypes.indexOf(target.value), 1)
    }
    // change detection hook can't detect changes in array. so converting array into a string
    // and then pipe for category/sub-category/item/addonGrp/addon will convert it into an array to filter based on that
    this.selectedFoodTypesInString = JSON.stringify(this.selectedFoodTypes);
    this.evaluateFilteredData();
  }

  evaluateFilteredData() {
    let filteredData: any[];
    if (!this.showAddons) {
      filteredData = this.categoryFilterPipe.transform(this.menuList, this.selectedFoodTypesInString);
      filteredData.length ? this.noFilteredData = false : this.noFilteredData = true;
    }
    else {
      filteredData = this.addonGroupFilterPipe.transform(this.addonGroupList, this.selectedFoodTypesInString);
      filteredData.length ? this.noFilteredData = false : this.noFilteredData = true;
    }
  }

  /**
   * Method that gets placeholder img url from global Var
   */
  getDummyMenuItemImage() {
    this.outletsService
      .getGlobalVarByKey('DUMMY_MENU_ITEM_IMAGE')
      .subscribe((res) => {
        this.dummyMenuItemImageUrl = res['result']['value'];
      });
  }

  /**
   * Method that adds placeholder image if menu image not found
   * @param event
   */
  onMenuImgError(event: Event) {
    const source = event.target as HTMLImageElement;
    if (source.src !== this.dummyMenuItemImageUrl) {
      source.src = this.dummyMenuItemImageUrl;
    }
  }

  /**
   * Method that adds info of category panel opened or not
   * @param id
   * @param flag
   */
  setOpenedCategorypanel(id, flag) {
    this.openedCategoryPanels[id] = flag;
  }

  /**
   * Method that returns if particular category panel is opened or not
   * @param id
   * @returns
   */
  isCategoryPanelOpened(id) {
    return this.openedCategoryPanels[id];
  }

  /**
   * Method that adds info of sub-category panel opened or not
   * @param id
   * @param flag
   */
  setopenedSubCategoryPanel(id, flag) {
    this.openedSubCategoryPanels[id] = flag;
  }

  /**
   * Method that returns if particular sub-category panel is opened or not
   * @param id
   * @returns
   */
  isSubCategoryPanelOpened(id) {
    return this.openedSubCategoryPanels[id];
  }

  /**
   * Method that adds info of addon-group panel opened or not
   * @param id
   * @param flag
   */
  setopenedAddonsPanel(id, flag) {
    this.openedAddonsPanels[id] = flag;
  }

  /**
   * Method that returns if particular addon-group panel is opened or not
   * @param id
   * @returns
   */
  isAddonsPanelOpened(id) {
    return this.openedAddonsPanels[id];
  }

  /**
   * Method that toggle between Item page and Add on page also hide and show Category sequence button
   */
  toggleItemsAndAddOnsPage() {
    this.showAddons = !this.showAddons;
    this.evaluateFilteredData();
  }
  
  /**
   * Method that expand/collapses expansion panel based on search term
   * @param event 
   * @returns 
   */
  onSearchTermChange(event: string) {
    this.searchMenu = event;
    if (!this.searchMenu) {
      this.openedCategoryPanels = {};
      this.openedSubCategoryPanels = {};
      this.openedAddonsPanels = {};
      return;
    };
    if (!this.showAddons) {
      for (const category of this.menuList) {
        for (const subCategory of category.subCategories) {
          for (const menuItem of subCategory.menuItems) {
            if (menuItem.itemName.toLowerCase().includes(this.searchMenu.toLowerCase())) {
              this.setOpenedCategorypanel(category.categoryId, true);
              this.setopenedSubCategoryPanel(subCategory.subCategoryId, true);
              break;
            }
          }
          if (subCategory.subCategoryName.toLowerCase().includes(this.searchMenu.toLowerCase())) {
            this.setOpenedCategorypanel(category.categoryId, true);
            break;
          }
        }
      }
    }
    else {
      for (const addonGroup of this.addonGroupList) {
        for (const addon of addonGroup.addons) {
          if (addon.addonName.toLowerCase().includes(this.searchMenu.toLowerCase())) {
            this.setopenedAddonsPanel(addonGroup.addonGroupId, true);
            break;
          }
        }
      }
    }
  }

  /**
   * Opens the modal for changing the sequence of main categories in the menu.
   */
  openCategorySequenceModal() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    this.isCategorySequenceModalVisible = true;
    this.isSubCategorySequenceModalVisible = false;
    this.isItemsSequenceModalVisible = false;
  }

  /**
   * Opens the modal for changing the sequence of subcategories in a main category of the menu.
   * @param categoryId The ID of the category whose subcategory sequence is to be modified.
   */
  openSubCategorySequenceModal(categoryId: number) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    this.isSubCategorySequenceModalVisible = true;
    this.isCategorySequenceModalVisible = false;
    this.isItemsSequenceModalVisible = false;
    this.categoryId = categoryId;
    this.menuList.forEach((menu) => {
      if(menu.categoryId === categoryId) {
        this.subCategoryList = menu.subCategories;
      }
    });
  }

  /**
   *  Opens the modal for changing the sequence of menu items based on a given subcategory ID.
   * @param subCategoryId The ID of the subcategory to base the item sequence change on.
   * @returns void.
   */
  openItemsSequenceModal(subCategoryId: number) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    this.isItemsSequenceModalVisible = true;
    this.isCategorySequenceModalVisible = false;
    this.isSubCategorySequenceModalVisible = false;
    this.subCategoryId = subCategoryId;
    this.menuList.forEach((menu) => {
      menu.subCategories.forEach((subCategory) => {
        if(subCategory.subCategoryId === subCategoryId) {
          this.menuItemList = subCategory.menuItems;
        }
      })
    })
  }

  /**
  * Closes the menu sequence modal by hiding all sequence modals.
  */
  closeSequenceModal() {
    this.isCategorySequenceModalVisible = false;
    this.isSubCategorySequenceModalVisible = false;
    this.isItemsSequenceModalVisible = false;
  }

  /**
   * Updates the sequence of categories in a menu list after a category is dropped.
   * @param event The drag and drop event containing the previous and current indices of the category.
   */
  dropCategorySequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuList, event.previousIndex, event.currentIndex);
  }

   /**
 * Saves the sequence of the main categories by updating the sequence value and sending a PUT request.
 * Shows a success message using toast message service upon successful response.
 */
  saveCategorySequence() {
    this.menuList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.menuList.map(category => (
        category.categoryId
      ))
    };
    this.outletsService.putMainCategorySequence(this.outletDetails.id,sequenceData).subscribe(response => {
      this.toastMsgService.showSuccess('Category sequence updated successfully');
      this.closeSequenceModal();
    });
  }

  /**
  * Updates the sequence of subcategories in a list after a subcategory is dropped.
  * @param event The drag and drop event containing the previous and current indices of the subcategory.
  */
  dropSubCategorySequence(event: CdkDragDrop<string[]>){
    moveItemInArray(this.subCategoryList, event.previousIndex, event.currentIndex);
  }

   /**
   * This method saves the sequence of subcategories in a given category.
   */
  saveSubCategorySequence() {
    this.subCategoryList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.subCategoryList.map(subCategory => (
        subCategory.subCategoryId
      ))
    };
    this.outletsService.putSubCategorySequence(this.categoryId, sequenceData).subscribe(response => {
      this.toastMsgService.showSuccess('Subcategory sequence updated successfully');
      this.closeSequenceModal();
    })
  }

 /**
 * Updates the sequence of menu items in a list after a menu item is dropped.
 * @param event The drag and drop event containing the previous and current indices of the menu item.
  */
  dropItemsSequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuItemList, event.previousIndex, event.currentIndex);
  }

  /**
   * The Method Save the sequence of items in a menu subcategory.
   */
  saveItemsSequence() {
    this.menuItemList.forEach((item, i) => {
      item.sequence = i + 1;
    });
    const sequenceData = {
      sorted_ids: this.menuItemList.map(menuItem => (
        menuItem.itemId
      ))
    };
    this.outletsService.putMenuItemSequence(this.subCategoryId, sequenceData).subscribe(response => {
      this.toastMsgService.showSuccess('Item sequence updated successfully');
      this.closeSequenceModal();
    })
  }
  
/**
 * Method that Toggles the selection of all addon groups. If all addon groups are already selected,
 * clears the selection; otherwise, selects all addon groups.
 */
selectAllAddOnGroups() {
  this.selectedAddOnGroups = this.getAllAddOnGroupsSelected() ? [] : this.addonGroupList.map((group) => group.addonGroupId);
}

/**
 * Method that Checks if all addon groups are selected.
 * @returns {boolean} True if all addon groups are selected, false otherwise.
 */
getAllAddOnGroupsSelected() {
  return this.selectedAddOnGroups.length === this.addonGroupList.length;
}

/**
 * Method that Handles the bulk deletion of addon groups based on the provided ID and checkbox state.
 * @param {number} id - The ID of the addon group to be added or removed from the selection.
 * @param {any} event - The checkbox change event.
 */
toggleSelectedAddonGroup(id: number, event: any) {
  event.checked
  ? this.selectedAddOnGroups.push(id)
  : (this.selectedAddOnGroups = this.selectedAddOnGroups.filter(groupId => groupId !== id));
}

/**
 * Method that Deletes the selected addon groups in bulk.
 * If no addon groups are selected, the method returns early.
 * After deletion, updates the addon groups list, resets the selection, and shows a success toast message.
 */
bulkDeleteSelectedAddOnsGroup() {
  if (this.selectedAddOnGroups.length === 0) {
    return;
  }

  const data = {
    ids: this.selectedAddOnGroups,
  };

  this.subscriptions.push(
    this.outletsService.deleteBulkAddonsGroup(data).subscribe((res) => {
      this.toastMsgService.showSuccess(`Addon-Group: ${this.selectedAddOnGroups.join(', ')}`);
      this.setAddonGroups();
      this.selectedAddOnGroups = [];
    })
  );
}

/**
 * Method that Retrieves the add-on group from the addonGroupList based on the specified group index.
 */
getAddonGroupByIndex(groupIndex: number): AddonGroup | undefined {
  return this.addonGroupList.find(addons => addons.addonGroupId === groupIndex);
}


/**
 * Method that Checks if all add-ons in a specified group are selected.
 * @param {number} groupIndex - The index of the add-on group to check.
 */
isAllAddOnSelected(groupIndex: number): boolean {
  const group = this.getAddonGroupByIndex(groupIndex);
  return !!group && this.selectedAddOnsByGroup[groupIndex]?.length === group.addons.length;
}


/**
 * Method that Selects or deselects all add-ons for a specified add-on group based on the current selection state.
 * If all add-ons are already selected, it deselects them; otherwise, it selects all add-ons.
 * Updates the selected add-ons list and the indeterminate state for the specified add-on group.
 *
 * @param {number} [groupIndex] - The index of the add-on group. If not provided, the method does nothing.
 */
toggleSelectAllAddOns(groupIndex?: number) {
  const group = this.getAddonGroupByIndex(groupIndex);

  if (!group) return;

  const selectedAddOnsForGroup = this.selectedAddOnsByGroup[groupIndex] || [];
  const allSelected = selectedAddOnsForGroup.length === group.addons.length;

  this.selectedAddOnsByGroup[groupIndex] = allSelected ? [] : group.addons.map(addon => addon.addonId);
  this.selectedAddOnsIndeterminate[groupIndex] =
    selectedAddOnsForGroup.length !== 0 && selectedAddOnsForGroup.length !== group.addons.length;
}


/**
 * Method that Updates the list of selected add-ons for a specified group based on the state of a checkbox.
 */
updateSelectedAddOns(id: number, event: any, groupIndex: number) {
  const selectedAddOnsForGroup = this.selectedAddOnsByGroup[groupIndex] || [];

  if (event.checked) {
    selectedAddOnsForGroup.push(id);
  } else {
    this.selectedAddOnsByGroup[groupIndex] = selectedAddOnsForGroup.filter(addonId => addonId !== id);
  }
}

/**
 * Method that Deletes selected add-ons for a specified group in bulk.
 * @param {number} groupIndex - The index of the add-on group for which selected add-ons should be deleted in bulk.
 */
bulkDeleteSelectedAddOns(groupIndex: number) {
  const selectedAddOnsForGroup = this.selectedAddOnsByGroup[groupIndex] || [];

  if (selectedAddOnsForGroup.length === 0) return;

  const data = { ids: selectedAddOnsForGroup };

  this.subscriptions.push(
    this.outletsService.deleteBulkAddons(data).subscribe(() => {
      this.toastMsgService.showSuccess(`Addon: ${selectedAddOnsForGroup.join(',')}`);
      this.setAddonGroups();
      this.toggleSelectAllAddOns(groupIndex);
    },
    (error) => {
      this.toastMsgService.showError("Addon can't be deleted as it is mapped with menu item");
    }
  )
);
}

  /**
   * Method that toggles copy menu item images modal
   */
  toggleCopyMenuItemImagesModal(){
    this.isCopyMenuItemImages = !this.isCopyMenuItemImages;
  }

  /**
   * Method that copies menu item images from one outlet to another
   */
  copyMenuItemImages(){
    const data={};
    if(this.service === Services.Food){
        data['source_restaurant_id']= this.sourceOutletId;
    }
    else if(this.service === Services.Grocery){
        data['source_store_id']= this.sourceOutletId
    }
    else{
        data['source_outlet_id']= this.sourceOutletId
    }
    this.outletsService.copyMenuItemImages(this.outletDetails.id,data).subscribe(response => {
      this.toastMsgService.showSuccess('Menu Item Images Copies Successfully !!!');
      this.toggleCopyMenuItemImagesModal();
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}