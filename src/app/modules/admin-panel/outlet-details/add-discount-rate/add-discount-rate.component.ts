import { Component, OnInit } from '@angular/core';
import { Category, Menu, MenuItem, SubCategory } from '../menu/model/menu';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { Subscription } from 'rxjs';
import { Outlet } from '../../outlets/model/outlet';
import { ToastService } from 'src/app/shared/services/toast.service';
import { permissionDeniedErrorMsg, Services } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-add-discount-rate',
  templateUrl: './add-discount-rate.component.html',
  styleUrls: ['./add-discount-rate.component.scss']
})
export class AddDiscountRateComponent implements OnInit {

  menuList: Menu[];
  categoryList: Category[] = [];
  subCategoryList: SubCategory[];
  menuItemList: MenuItem[];
  subscriptions: Subscription[] = [];
  outletDetails: Outlet;
  categoryDiscountRate: number;
  subCategoryDiscountRate: number;
  itemDiscountRate: number;
  outletId = [];
  mainCategoryId = [];
  subcategoryId = [];
  itemId = [];
  restaurant: {
    id: string,
    discountRate: number
  } = {} as any;
  selectedOption: string = 'restaurant';
  service: string;
  readonly Services: Services;
  hasEditAccess: boolean;

  constructor(private outletsService: OutletsService, private toastMsgService: ToastService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.outletDetails = this.outletsService.outletDetails;
    this.service = this.outletsService.service;
    this.hasEditAccess = this.sharedService.hasEditAccessForOutletDetails;
    this.getMenuData();
  }
  /**
 * Retrieves menu data from the outlets service and organizes it into arrays for use in the component.
 */
  getMenuData() {
    this.subscriptions.push(
      this.outletsService.getMenu(this.outletDetails.id).subscribe((res) => {
        this.subCategoryList = [];
        this.menuList = [];
        this.menuItemList = [];
        for (const i of res.result) {
          const menu = Menu.fromJson(i);
          this.menuList.push(menu);
          this.categoryDiscountRate = i.discount_rate;
          for (const j of menu.subCategories) {
            this.subCategoryList.push(j);
            this.subCategoryDiscountRate = j.discountRate;
            for (const k of j.menuItems) {
              this.menuItemList.push(k);
              this.itemDiscountRate = k.discountRate;
            }
          }
        }
      })
    );
  }

  /**
 * Method that Constructs an object containing discount rate data for the restaurant, main categories, subcategories, or menu items
 * and sends it to the outlets service to update the discount rates for the outlet.
 */
  addDiscountRate() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    const data: any = {};
    if (this.restaurant.discountRate) {
      if(this.service === Services.Food){
      data.restaurant = {
        restaurant_id: this.restaurant.id,
        discount_rate: this.restaurant.discountRate
      }
    }
    else if(this.service === Services.Grocery){
      data.store = {
        store_id: this.restaurant.id,
        discount_rate: this.restaurant.discountRate
      }
    }
    else if(this.service === Services.Flower || this.service === Services.Paan || this.service === Services.Pharmacy || this.service === Services.Pet){
      data.outlet = {
        outlet_id: this.restaurant.id,
        discount_rate: this.restaurant.discountRate
      }
    }
    }else if (this.mainCategoryId.length > 0) {
      data.main_categories = this.mainCategoryId.map(item => {
        return {
          main_category_id: item.m[0],
          discount_rate: item.m[1]
        }
      });
    } else if (this.subcategoryId.length > 0) {
      data.sub_categories = this.subcategoryId.map(item => {
        return {
          sub_category_id: item.s[0],
          discount_rate: item.s[1]
        }
      });
    } else if (this.itemId.length > 0) {
      data.menu_items = this.itemId.map(item => {
        return {
          menu_item_id: item.i[0],
          discount_rate: item.i[1]
        }
      });
    }
    this.outletsService.putDiscountRate(this.outletDetails.id, data).subscribe((res) => {
      this.toastMsgService.showSuccess('Discount rate updated successfully.');
      this.getMenuData();
    });
    this.mainCategoryId = [];
    this.subcategoryId = [];
    this.itemId = [];
    this.restaurant = {} as any;

  }

  /**
 * Sets the discount rate for the specified category or item.
 * @param name - Name of the category or item.
 * @param id - ID of the category or item.
 * @param discountRate - Discount rate to be set.
 */
  setDiscountRate(name: string, id?: string, discountRate?: number) {
    if (name === 'outlet') {
      this.restaurant = {
        id: id,
        discountRate: discountRate
      }
    }
    if (name === 'category') {
      const m = [];
      m.push(id, discountRate)
      this.mainCategoryId.push({ m });

    }
    if (name === 'subcategory') {
      const s = [];
      this.mainCategoryId = [];
      s.push(id, discountRate)
      this.subcategoryId.push({ s });
    } 
    if (name === 'item') {
      const i = [];
      i.push(id, discountRate)
      this.itemId.push({ i })
    } 
  } 
}