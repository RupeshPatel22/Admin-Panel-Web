import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import * as apiUrls from '../../core/apiUrls'
import { CookieService } from 'ngx-cookie-service'
import { getApps, getApp, initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { environment } from 'src/environments/environment'
import { ToastService } from './toast.service'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component'
import { Router } from '@angular/router'
import { apiEndPoints, Services } from '../models/constants/constant.type'
import { SharedService } from './shared.service'

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  globalVarFood: Map<string, any> = new Map<string, any>();
  globalVarRider: Map<string, any> = new Map<string, any>();
  service$: BehaviorSubject<string> = new BehaviorSubject(null)
  riderNotAvailableAlert: any
  riderNotAvailableAlertNotificationSoundInterval: any
  playNotificationSoundForRiderNotAvailable: { [key: number]: boolean } = {}
  playNotificationSoundForNewOrder: { [key: number]: boolean } = {}
  newOrderAlert: any
  newOrderAlertNotificationSoundInterval: any
  errorCaught: boolean
  playNotificationSoundForOrderCancelled: { [key: number]: boolean } = {}
  cancelOrderAlert: any
  cancelOrderAlertNotificationSoundInterval: any
  constructor (
    private http: HttpClient,
    private cookieService: CookieService,
    private toastMsgService: ToastService,
    private dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService
  ) {}

  get service () {
    return this.sharedService.service
  }

  /**
   * Method that initialises push notification connection
   */
  initPushNotificationConnection () {
    Notification.requestPermission().then(status => {
      if (status === 'denied') {
        this.toastMsgService.showInfo(
          'For receiving notifications kindly allow Notification from browser settings. For any further assistance call customer care.',
          'Notification',
          {
            closeButton: true,
            extendedTimeOut: 0,
            timeOut: 7000
          }
        )
        Notification.requestPermission().then(status => {})
      } else if (status === 'granted') {
        if (!getApps().length) {
          initializeApp(environment.firebaseConfig)
        } else {
          getApp()
        }
        const messaging = getMessaging()
        getToken(messaging).then(token => {
          const data = {
            token: token,
            device_id: this.cookieService.get('deviceId'),
            device_type: 'desktop'
          }
          this.postPushNotificationToken(data).subscribe()
        })

        onMessage(messaging, payload => {
          const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.image,
            data: payload.data
          })
          console.log(notification, 'not')
          notification.addEventListener('click', e => {
            this.onClickPushNotification(e)
          })
          // if (notification.title === 'No Rider available' || notification.title === 'New Order' || notification.title === 'Order Cancelled') {
          //   this.showDialogBox(notification.title, notification.body,notification);
          // }
          
        })
      }
    })
  }

  /**
   * Method that invokes on click of the push notification
   * @param event
   */
  onClickPushNotification (event: Event) {
    const target = event.target as Notification;
    let link: string;
    // TODO add conditions to open urls based on template ids
    if(target.title === 'No Rider available'){
      link = this.router.serializeUrl(this.router.createUrlTree(['rider/riders-allocation'], {
        queryParams: { orderId: target.data.order_id }
      }));
      window.open(link);
    }
    if(target.title === "New Order"  || target.title === "Order Cancelled"){
      link = this.router.serializeUrl(this.router.createUrlTree([`${target.data.service_name.replace(/"/g, "")}/orders`], {
        queryParams: { expanded: target.data.order_id }
      }))
      window.open(link);
    }
  }

  /**
   * Method that send push notification token
   * @param data
   * @returns response
   */
  postPushNotificationToken (data: any): Observable<any> {
    return this.http
      .post(apiUrls.postTokenForPushNotificationEndPoint, data)
      .pipe(
        map(response => {
          return response
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.toastMsgService.showWarning(
              'Kindly login again to start receiving notification',
              'Notification',
              { disableTimeOut: true }
            )
          }
          throw err
        })
      )
  }
  /**
   * Method that delete push notification token
   * @returns response
   */
  deletePushNotificationToken (): Observable<any> {
    return this.http
      .delete(
        apiUrls.deleteTokenForPushNotificationEndPoint(
          this.cookieService.get('deviceId') || 'device-id' //sending dummy device-id in case not stored in cookie
        )
      )
      .pipe(
        map(response => {
          return response
        })
      )
  }

  /**
   * Method that gets push notifications data for user based on filter params
   * @param data
   * @returns
   */
  filterPushNotifications (data: any): Observable<any> {
    return this.http
      .post(apiUrls.postFilterPushNotificationsEndPoint, data)
      .pipe(
        map(response => {
          const records = response['result']['records'][0]
          return response
        })
      )
  }

  /**
   * Method that gets all global vars for vendor and sets
   * all with key value pair in BehaviourSubject
   * @returns
   */
  getGlobalVarFood (): Observable<any> {
    return this.http
      .get(apiUrls.getGlobalVarEndPoint(apiEndPoints['food']))
      .pipe(
        map(response => {
          for (const i of response['result']) {
            this.globalVarFood.set(i['key'], i['value'])
          }
        })
      )
  }
  getGlobalVarRider (): Observable<any> {
    return this.http
      .get(apiUrls.getGlobalVarEndPoint(apiEndPoints['rider']))
      .pipe(
        map(response => {
          for (const i of response['result']) {
            this.globalVarRider.set(i['key'], i['value'])
          }
        })
      )
  }
  
  /**
   * Method that change notification read status
   * @param data
   * @returns
   */
  changePushNotificationStatus (data: any): Observable<any> {
    return this.http
      .post(apiUrls.postChangePushNotificationReadStatusEndPoint, data)
      .pipe(
        map(response => {
          return response
        })
      )
  }

  /**
   * Method that:
   * 1. Shows dialog box for rider manual allocation, new order and cancel order
   * 2. Plays audio for notifications
   * 3. Creates broadcast channel so that dialog box and audio is terminated in every tab
   * @param notificationTitle 
   * @param notificationBody 
   * @param notification 
   */
  showDialogBox(notificationTitle, notificationBody, notification) {
    const dialogChannel = new BroadcastChannel('dialog-channel');
    const broadcastChannel = new BroadcastChannel('dialog-broadcast-channel');
    let playNotificationSound = {};
    let notificationSoundInterval;
    switch (notificationTitle) {
      case 'No Rider available':
        playNotificationSound = this.playNotificationSoundForRiderNotAvailable;
        this.riderNotAvailableAlert = new Audio(
          this.globalVarRider.get('AUTOMATIC_RIDER_ALLOCATION_FAILED_NOTIFICATION_SOUND')
          );
          this.riderNotAvailableAlertNotificationSoundInterval = setInterval(() => {
            this.bombardNotificationSound(this.riderNotAvailableAlert,this.playNotificationSoundForRiderNotAvailable);
          }, 1200);
          notificationSoundInterval = this.riderNotAvailableAlertNotificationSoundInterval;
        break;
      case 'New Order':
        playNotificationSound=this.playNotificationSoundForNewOrder;
        this.newOrderAlert = new Audio(
          this.globalVarFood.get('NEW_ORDER_NOTIFICATION_SOUND')
          );
          this.newOrderAlertNotificationSoundInterval = setInterval(() => {
            this.bombardNotificationSound(this.newOrderAlert,this.playNotificationSoundForNewOrder);
          }, 1200);
          notificationSoundInterval=this.newOrderAlertNotificationSoundInterval;
        break;
      case 'Order Cancelled':
        playNotificationSound = this.playNotificationSoundForOrderCancelled;
        this.cancelOrderAlert = new Audio(
          this.globalVarFood.get('ORDER_CANCELLED_NOTIFICATION_SOUND')
          );
          this.cancelOrderAlertNotificationSoundInterval = setInterval(() => {
            this.bombardNotificationSound(this.cancelOrderAlert,this.playNotificationSoundForOrderCancelled);
          }, 1200);
          notificationSoundInterval=this.cancelOrderAlertNotificationSoundInterval;
        break;
      default:
        break;
    }
    playNotificationSound[notificationTitle] = true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: notificationBody,
        confirmBtnText: 'OK',
        dismissBtnText: 'CANCEL',
        alert: true
      }
    });
    dialogChannel.postMessage({ type: 'openDialog' });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        switch (notificationTitle) {
          case 'No Rider available':
            const riderLink = this.router.serializeUrl(this.router.createUrlTree(['/rider/riders-allocation'], {
                  queryParams: {
                    orderId: notification.data.order_id,
                  }
                }));
                window.open(riderLink);
            // this.router.navigate(['/rider/riders-allocation'], {
            //   queryParams: { orderId: notification.data.order_id }
            // });
            break;
          case 'New Order' || 'Order Cancelled':
            const newOrderLink = this.router.serializeUrl(this.router.createUrlTree(['/food/orders'], {
              queryParams: {
                expanded: notification.data.order_id,
              }
            }));
            window.open(newOrderLink);
            // this.router.navigate(['/food/orders'], {
            //   queryParams: { expanded: notification.data.order_id }
            // });
            break;
          default:
            break;
        }
        broadcastChannel.postMessage({ type: 'closeDialog' });
        dialogRef.close();
        clearInterval(notificationSoundInterval);
        playNotificationSound[notificationTitle] = false;
      }
      else{
        broadcastChannel.postMessage({ type: 'closeDialog' });
        dialogRef.close();
        clearInterval(notificationSoundInterval);
        playNotificationSound[notificationTitle] = false;
      }
    });
    broadcastChannel.addEventListener('message', event => {
      if (event.data.type === 'closeDialog') {
        dialogRef.close();
        clearInterval(notificationSoundInterval);
        playNotificationSound[notificationTitle] = false;
        dialogChannel.close();
      }
    });
  }

  // /**
  //  * Method that bombard notifcation sound
  //  * @param alert 
  //  * @param playNotificationObj 
  //  */
  bombardNotificationSound(alert, playNotificationObj) {
    alert.pause();
    const count = Object.values(
      playNotificationObj
    ).filter((a) => a === true).length;
    if (count) {
      alert.play().catch((error) => {
        if (!this.errorCaught) {
          this.errorCaught = true;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              message:
                'For receiving notifications sound kindly click anywhere on the page !!!',
              confirmBtnText: 'OK',
              alert: true,
            },
          });
          dialogRef.afterClosed().subscribe((response) => {
            if (response) {
              // Perform any actions needed when the confirm button is clicked
            }
          });
        }
      });
    } else {
      alert.pause();
      clearInterval(alert);
    }
  }

  /**
   * Method that fatches notification data
   * @param data 
   * @returns response
   */
  postPushNotificationFilter(data: any): Observable<any> {
    return this.http.post(apiUrls.postPushNotificationFilterEndPoint(apiEndPoints[this.service]),data).pipe(
      map(response => {
        return response;
      })
    )
  }
}
