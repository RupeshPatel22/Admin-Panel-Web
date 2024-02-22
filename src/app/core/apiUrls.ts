import { IApiEndPoint } from './../shared/models/constants/constant.type';
import { environment } from '../../environments/environment';

// Login API
export const postSendLoginOtpEndPoint = `${environment.baseUrl}/user/admin/auth/login/otp`;
export const postVerifyLoginOtpEndPoint = `${environment.baseUrl}/user/admin/auth/login/verify`;
// Home APIs
export const postOutletsFilterEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/filter`;
}
export const getOutletDetailsEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}`;
}
export const putOutletDetailsEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}`;
}
export const postOutletHolidaySlotEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/createHolidaySlot`;
}
export const getOutletHolidaySlotsEndPpoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/holidaySlot`;
}
export const deleteOutletHolidaySlotEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/holidaySlot`;
}
export const getOutletTimeSlotEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/slot`;
}
export const putOutletTimeSlotEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/slot`;
}
export const putOutletStatusEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/disable`;
}
export const postFilterSalesReportEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/report/${apiEndPoint.prefix}/${id}/sales`;
}
export const getVendorLoginDetailsByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/vendor_login_details`;
}

// City - Polygon (Area) APIs
export const getCityListEndPoint = `${environment.baseUrl}/core/admin/city`;
export const postCityEndPoint = `${environment.baseUrl}/core/admin/city`;
export const putCityEndPoint = (id: string) => {
  return `${environment.baseUrl}/core/admin/city/${id}`;
}
export const deleteCityEndPoint = (id: string) => {
  return `${environment.baseUrl}/core/admin/city/${id}`;
}
export const getAreaListEndPoint = `${environment.baseUrl}/core/admin/polygon`;
export const postAreaPolygonEndPoint = `${environment.baseUrl}/core/admin/polygon`;
export const deleteAreaPolygonEndPoint = (id: string) => {
  return `${environment.baseUrl}/core/admin/polygon/${id}`
}
export const postFilterAreaPolygonEndPoint = `${environment.baseUrl}/core/admin/polygon/filter`;
// Cuisines APIs
export const getCuisinesListEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/cuisine`;
}
export const postCuisineEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/cuisine`;
}
export const putCuisineEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/cuisine/${id}`
}
export const deleteCuisineEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/cuisine/${id}`
}
// Cancellation Reason APIs
export const getAllCancellationReasonsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/cancellation_reason/all`;
}
export const getCancellationReasonsForAdminEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/cancellation_reason`;
}
export const postCancellationReasonEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/cancellation_reason`;
}
export const putCancellationReasonEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/cancellation_reason/${id}`;
}
export const deleteCancellationReasonEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/cancellation_reason/${id}`;
}
// Upload file APIs
export const getFileUploadUrlEndPoint = (fileExtn: string) => {
  return `${environment.baseUrl}/core/common/getUploadURL/${fileExtn}`;
};
export const postUploadedFileNameEndPoint = (url: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/${url}`;
}
// Download Data APIs
export const getDownloadFileEndPoint = (url: string, ids: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/${url}/${ids}`
}
export const getSampleFileFormatEndPoint = (url: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/${url}`
}
// APIs Endpoint for Menu
export const getMenuByOutletIdEndPoint = (outletId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/${outletId}`;
}
// (Category)
export const getMainCategoriesEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/main_category`;
}
export const postMainCategoryEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/main_category`;
}
export const putMainCategoryEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/main_category/${id}`;
}
export const deleteMainCategoryEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/main_category/${id}`;
}
export const postMainCategoryHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/main_category/${id}/createHolidaySlot`;
}
// (Sub-Category)
export const getSubCategoriesByCategoryIdEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/sub_category`;
}
export const postSubCategoryEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/sub_category`;
}
export const putSubCategoryEndPoint = (subCategoryId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/sub_category/${subCategoryId}`;
}
export const deleteSubCategoryEndPoint = (subCategoryId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/sub_category/${subCategoryId}`;
}
export const postSubCategoryHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/sub_category/${id}/createHolidaySlot`;
}
// (Item)
export const getItemByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/menu_item/${id}`;
}
export const postItemEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/menu_item`;
}
export const putItemEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/menu_item/${itemId}`;
}
export const deleteItemEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/menu_item/${itemId}`;
}
export const postItemHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/menu_item/${id}/createHolidaySlot`;
}
// (Add-on Group)
export const getAddonGroupListEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon_group`;
}
export const postAddonGroupEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon_group`;
}
export const putAddonGroupEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon_group/${id}`;
}
export const deleteAddonGroupEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon_group/${id}`;
}
export const postAddonGroupHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon_group/${id}/in_stock`;
}
export const bulkDeleteAddonsGroupEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon_group`;
}
// (Add-on)
export const getAddonByAddonGroupIdEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon`;
}
export const postAddonEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon`;
}
export const putAddonEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon/${id}`;
}
export const deleteAddonEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon/${id}`;
}
export const postAddonHolidaySlotEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon/${id}/in_stock`;
}
export const bulkDeleteAddons = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/addon`;
}
// Payouts APIs
export const getPayoutAccountsDetailsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout_account`;
}
export const postFilterPayoutsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/filter`;
}
export const postRetryPayoutByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/${id}/retry`;
}
export const postStopRetryPayoutByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/${id}/stopRetry`;
}
export const postMarkCompletePayoutByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/${id}/markComplete`;
}
// Catalog Approval API
export const postCatalogApprovalEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/approval/catalog`;
}
// Menu Changes Approval APIs
export const postFilterMenuChangesApprovalEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/approval/filter`;
}
export const postMenuChangesReviewEndPoint = (ids: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/approval/review/${ids}`;
}
// Orders APIs
export const postFilterOrdersEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/filter`;
}
export const postCancelOrderByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/${id}/cancel`;
}
export const postRefundEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/${id}/settle_refund`;
}
export const postMarkForRefundEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/${id}/mark_for_refund`;
}

// Pickup & Drop Category APIs
export const getPndCategoryEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/category`;
}
export const postPndCategoryEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/category`;
}
export const putPndCategoryEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/category/${id}`;
}
export const deletePndCategoryEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/category/${id}`;
}
// API for Refresh Token
export const postRefreshTokenEndPoint = `${environment.baseUrl}/user/token/refresh`;
// APIs for Rider Service
export const postFilterRidersEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/filter`;
}
export const postFilterRiderOrdersEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/filter`;
}
export const getRiderClientsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client`;
}
export const postRiderClientEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client`;
}
export const postRiderClientPricingEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client/${id}/delivery_charge`;
}
export const putClientAuthTokenEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client/authToken/${id}`;
}
export const putClientCallbackTokenEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client/callbackToken/${id}`;
}
export const putClientOrderStatusCbEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client/orderStatusCb/${id}`;
}
export const putClientRiderLocationCbEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/client/riderLocationCb/${id}`;
}
export const postBlockRiderByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/block/${id}`;
}
export const postUnBlockRiderByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/unblock/${id}`;
}
export const postFilterRiderLiveLocationEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/filter/location`;
}
export const getOrderAllocationHistoryByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/allocationHistory/${id}`;
}
export const getOrderStatusHistoryByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/statusHistory/${id}`;
}
export const postRiderOrderSettlementByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/settle/${id}`;
}
export const putRemoveRiderFromOrderByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/remove/${id}`;
}

// Rider Payouts
export const postFilterRiderPayoutsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/filter`;
}
export const postRetryRiderPayoutByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/${id}/retry`;
}
export const postStopRetryRiderPayoutByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/${id}/stopRetry`;
}
export const postMarkCompleteRiderPayoutByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/payout/${id}/markComplete`;
}
// APIs for subscription plans
export const postFilterSubscriptionPlansEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/plan/filter`;
}
export const postSubscriptionPlanEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/plan`;
}
export const putSubscriptionPlanByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/plan/${id}`;
}
// APIs for subscriptions
export const postFilterSubcriptionsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/filter`;
}
export const postSubscriptionEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription`;
}
export const postCancelSubscriptionByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/${id}/cancel`;
}
export const postRetrySubscriptionPaymentByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/${id}/retry_payment`;
}
export const postActivateSubscriptionByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/${id}/activate`;
}
// APIs for Subscription Payments
export const postFilterSubscriptionPaymentsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/subscription/payment/filter`;
}

// APIs for Global Var
export const getGlobalVarEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/globalVar`;
}
export const getGlobalVarByKeyEndPoint = (key: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/globalVar/${key}`;
}
export const putGlobalVarByKeyEndPoint = (key: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/globalVar/${key}`;
}

// APIs for Push Notifications
export const postTokenForPushNotificationEndPoint = `${environment.baseUrl}/notification/admin/push_notification/token`;
export const deleteTokenForPushNotificationEndPoint = (deviceId: string) => {
  return `${environment.baseUrl}/notification/admin/push_notification/token/${deviceId}`;
}

export const postFilterPushNotificationsEndPoint = `${environment.baseUrl}/notification/admin/push_notification/filter`;

//API for Pet Pooja
export const getPetPoojaFetchMenuByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/petpooja/fetch_menu/${id}`;
}
export const postPetPoojaInitiateByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/petpooja/initiate/${id}`;
}
export const getPetPoojaOnboardByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/petpooja/onboard/${id}`;
}
export const putPetPoojaOnboardByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/petpooja/onboard/${id}`;
}
export const postPetPoojaOnboardByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/petpooja/onboard/${id}`;
}
export const postPetPoojaDetachByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/petpooja/detach/${id}`;
}

//APIs for Rider shifts
export const getAllRidersShifts = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/shift`;
}
export const deleteRiderShifts = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/shift/delete/${id}`;
}
export const postCreateRiderShifts = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/shift/create`;
}
export const putUpdateRiderShifts = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/shift/update`;
}
export const postFilterAllRidersShift = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/shift/filter_rider_shifts`;
}
export const postSettleRiderShiftById = (riderShiftId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/shift/settle/${riderShiftId}`;
}
export const postRiderPodCollections = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/podCollection/filter`;
}
export const postRiderPodCollectionsV1_1 = ( apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/v1.1/podCollection/filter`;
}
export const postRiderPodCollectionsCSV = ( apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/podCollection/filter/csv`;
}
export const postFilterRiderPodCollectionShiftEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/podCollectionShift/filter`;
}

// Rider Pod deposit Apis
export const postFilterRiderPodDepositsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/deposit/filter`;
}
export const postRiderPodDepositByIdEndPoint = (riderId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/deposit/${riderId}`;
}

export const patchCancelRiderPodDepositByIdEndPoit = (depositId: number,apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/deposit/${depositId}/cancel`;
}

// APIs for admin users
export const postFilterAdminUsersEndPoint = `${environment.baseUrl}/user/admin/filter`;
export const postAdminUserEndPoint = `${environment.baseUrl}/user/admin/create`;
export const putAdminUserEndPoint = (id: string) => {
  return `${environment.baseUrl}/user/admin/${id}`;
};

//APIs Rider manual allocation 
export const getAvailableRidersForOrderEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/available_riders/${id}`;
}

//API for Rider manual assignment
export const postAssignRiderManuallyEndPoint = (orderId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/assign_rider/${orderId}`;
}

//API for Vendor set password
export const postVendorSetPasswordEndPoint = `${environment.baseUrl}/user/admin/vendor/setPassword`;

//API for change status of push notification
export const postChangePushNotificationReadStatusEndPoint = `${environment.baseUrl}/notification/admin/push_notification/change_read_status`;

//API for menu sequence
export const putMainCategorySequenceEndPoint = (id: string, apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/menu/main_category/sequence/${id}`;
}

export const putSubcategorySequenceEndPoint = (categoryId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/sub_category/sequence/${categoryId}`;
}

export const putMenuItemSequenceEndPoint = (subCategoryId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/menu_item/sequence/${subCategoryId}`;
}

export const putVariantGroupSequenceEndPoint = (itemId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/item_variant_group/sequence/${itemId}`;
}

export const putVariantSequenceEndPoint = (variantGroupId: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/item_variant/sequence/${variantGroupId}`;
}

export const putMasterCategorySequenceEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/masterCategory/sequence`;
}

//API for get child restaurant detials
export const getChildRestaurantEndPoint = (parentId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/restaurant/child/${parentId}`;
}

//API for make outlet as child restaurant
export const putChildRestaurantEndPoint = (childId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/restaurant/parent/${childId}`;
}

export const getParentRestaurantEndPoint = (childId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/restaurant/parent/${childId}`;
}

//API for Discount Rate
export const putDiscountRateEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/menu/discount/${id}`;
}
//API for delete child restaurants
export const deleteChildRestaurantEndPoint = (childId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/restaurant/parent/${childId}`;
}

//API for rider detail update
export const putRiderDetailUpdateEndPoint = (riderId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/update/${riderId}`;
}

//API for rider ping logs
export const postRiderPingLogsEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/log/filter`;
}

// APIs for customer-users
export const postFilterCustomersEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/customer/filter`;
}
export const putBlockCustomerByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/customer/block/${id}`;
}
export const putUnBlockCustomerByIdEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/customer/unblock/${id}`;
}

//API for customer review
export const postCustomerReviewEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/${apiEndPoints.prefix}/review/filter`;
}

//API for block unblock admin
export const  putBlockAdminByIdEndPoint = (adminId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/block/${adminId}`;
}
export const putUnBlockAdminByIdEndPoint = (adminId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/unblock/${adminId}`;
}

// APIs for client logs
export const postClientLog = `${environment.baseUrl}/core/client_log`;
export const postFilterClientLog = `${environment.baseUrl}/core/admin/client_log/filter`;

// APIS for Operational City
export const postOperationalCityEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_city`;
}
export const getOperationalCityByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_city/${id}`;
}
export const putOperationalCityByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_city/${id}`;
}
export const deleteOperationalCityByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_city/${id}`;
}
export const filterOperationalCityEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_city/filter`;
}

// APIS for Operational Zone
export const postOperationalZoneEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_zone`;
}
export const getOperationalZoneByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_zone/${id}`;
}
export const putOperationalZoneByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_zone/${id}`;
}
export const deleteOperationalZoneByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_zone/${id}`;
}
export const filterOperationalZoneEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/operational_zone/filter`;
}

// APIS for Black Zone
export const postBlackZoneEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/black_zone`;
}
export const getBlackZoneByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/black_zone/${id}`;
}
export const putBlackZoneByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/black_zone/${id}`;
}
export const deleteBlackZoneByIdEndPoint = (id: number, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/black_zone/${id}`;
}
export const filterBlackZoneEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/black_zone/filter`;
}

// APIs for rider-operational zone mapping
export const getRiderOperationalZoneByIdEndPoint = (riderId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/rider_operational_zone/operational_zones/${riderId}`;
}
export const postRiderOperationalZoneByIdEndPoint = (riderId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/rider_operational_zone/${riderId}`;
}
export const deleteRiderOperationalZoneByIdEndPoint = (riderId: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/rider_operational_zone/${riderId}`;
}

//APIs for rider live statistics
 export const getLiveStatisticsEndPoint =  (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/live_statistics`;
}

export const postLiveStaticsEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/live_statistics/filter`;
}

//APIs for all services data
export const getAllServicesEndPoint = `${environment.baseUrl}/core/admin/service`;

export const putServicesEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/service/${id}`;
}

// API for Speedyy Charges
export const putSpeedyyChargesByOutletId = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/speedyyCharges`;
}

// API for Delivery Splliting
export const putDeliverySplittingByOutletId = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/delivery_splitting`;
}

//API for change log
export const postChangesLog = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/change_log/filter`;

}

// Active Orders APIs
export const postActiveOrderEndPoint = `${environment.baseUrl}/core/admin/active_orders`;


// APIs for banner
export const getBannersEndPoint = ( apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/banner`;
}

export const postBannersEndPoint = ( apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/banner`;
}

export const putBannersEndPoint = ( id: string, apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/banner/${id}`;
}

export const deleteBannersEndPoint = ( id: string, apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/banner/${id}`;
}


//APIs for Master Surge
export const postFilterMasterSurgeEndPoint = ( apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge/filter`;
}

export const getMasterSurgeEndPoint = ( id: number, apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge/${id}`;
}

export const putMasterSurgeEndPoint = ( id: number, apiEndPoint:IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge/${id}`;
}

export const deleteMasterSurgeEndPoint = ( id: number, apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge/${id}`;
}

export const postCreateMasterSurge = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge`;
}

export const postSurgeMappingEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/surge/mapping`;
}

export const postSurgeMappingFilterEndPoint = ( apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge/mapping/filter`;
}

export const deleteSurgeMappingEndPoint = ( id: number, apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/surge/mapping/${id}`;
}
//API For Master Category Menu
export const getMasterCategoryForMenuEndPoint = (apiEndPoints: IApiEndPoint) => { 
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/masterCategory`;
}
//APIs that Add, Update, delete and Fetch data for Master Category in Grocery
export const getMasterCategoryEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/masterCategory`;
}

export const postMasterCategoryEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/masterCategory`;
}

export const putMasterCategoryEndPoint = (apiEndPoints: IApiEndPoint, id: string) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/masterCategory/${id}`;
}

export const deleteMasterCategoryEndPoint = (apiEndPoints: IApiEndPoint, id: string) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/masterCategory/${id}`;
}

//API that send payout report on email
export const postPayoutReportOnEmailEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/payout/report`;
}

//API that copies menu item images
export const putCopyItemImages = (apiEndPoints: IApiEndPoint, id: string) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/menu/copy_item_images/${id}`;
}

//API that send notification to vendor
export const postSendNotificationSoundEndPoint = ( id: any, apiEndPoint: IApiEndPoint ) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/${id}/send_notification`;
}

//API that get notification data
export const postPushNotificationFilterEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/push_notification/filter`;
}
//API that get vendor details
export const postVendorUsersEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/vendor/filter`;
}

//API that Filter Merchant data
export const postPndMerchantEndPoint = (apiEndPoints: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/merchant/filter`;
}

//API that approve KYC for Merchant
export const postMerchantKycApproveEndPoint = (apiEndPoints: IApiEndPoint, merchantId: string) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/merchant/kyc/approve/${merchantId}`;
}

//API that update Merchant details 
export const putUpdateMerchantEndPoint = (apiEndPoints: IApiEndPoint, merchantId: string) => {
  return `${environment.baseUrl}/${apiEndPoints.service}/admin/merchant/update/${merchantId}`;
}

//API for Inquiry Orders
export const postFilterInquiryOrdersEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/inquiry/filter`;
}

export const getInquiryOrderDetailsEndPoint = (id: any, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/order/inquiry/${id}`;
}