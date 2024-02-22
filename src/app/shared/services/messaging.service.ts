import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Socket, connect } from 'socket.io-client';
import { ISocketTemplate, socketTemplates } from 'src/app/modules/dashboard/model/dashboard';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { LoginService } from './login.service';
import * as apiUrls from 'src/app/core/apiUrls';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  socket: Socket;
  audioQueue: string[] = [];
  audioAlert: any;
  dialogRefArr: MatDialogRef<ConfirmationDialogComponent, any>[] = [];
  dialogChannel = new BroadcastChannel('dialogChannel');
  // error$ = new Subject<any>();
  constructor(private loginService: LoginService, private dialog: MatDialog, private router: Router, private http: HttpClient) {
    this.broadCastChannelListener();
    // this.error$
    //   .pipe(
    //     debounceTime(10000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(error => {
    //     this.createLog(error).subscribe();
    //   });

   }

  /**
   * Method that initialize socket connection
   */
  openWsConnection() {
    this.socket = connect(environment.baseUrl, {
      path: '/ws/socket.io',
      withCredentials: true,
      auth: { token: localStorage.getItem('token') },
    });

    this.socket.on('connect', () => {
      console.log('connection established')
      this.socket.emit('online');
    });

    this.socket.on("connect_error", (error) => {
      console.log('connect_error', error.message);
      // this.error$.next(error)
      if (error.message.includes('forbidden')) {
        this.loginService.refreshAuthToken().subscribe(() => {
          this.socket.auth = { token: localStorage.getItem('token') }
          this.socket.connect();
        })
      }

    });

    this.socket.on('user_details', (data) => { console.log(data) });
    this.socket.on('ORDER_PLACED', (data) => {
      this.handleSocketEvent(socketTemplates.ORDER_PLACED(data, this.router));
    });
    this.socket.on('ORDER_CANCELLED', (data) => {
      this.handleSocketEvent(socketTemplates.ORDER_CANCELLED(data, this.router));
    });
    this.socket.on('ORDER_ALLOCATION_MAX_ATTEMPT', (data) => {
      this.handleSocketEvent(socketTemplates.ORDER_ALLOCATION_MAX_ATTEMPT(data, this.router));
    });
    this.socket.on('ORDER_ALLOCATION_NO_RIDER', (data) => {
      this.handleSocketEvent(socketTemplates.ORDER_ALLOCATION_NO_RIDER(data, this.router));
    });
    this.socket.on('RIDER_PING_UPDATES', (data) => {
      this.handleSocketEvent(socketTemplates.RIDER_PING_UPDATES(data, this.router));
    });
  }

  /**
   * Method that closes socket connection
   */
  closeWsConnection() {
    this.socket.disconnect();
  }

  /**
   * Method that executes when socket event is received received
   * @param obj 
   */
  handleSocketEvent(obj: ISocketTemplate) {
      this.audioQueue.push(obj.soundKey);
      if (this.audioQueue.length === 1) this.playAudio();
      this.openDialog(obj);
  }

  /**
   * Method that plays audio when socket event is received
   */
  playAudio() {
    this.audioAlert = new Audio(this.audioQueue[0]);
    this.audioAlert.loop = true;
    this.audioAlert.play().catch((error) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'For receiving notifications sound kindly click here !!!',
          confirmBtnText: 'OK'
        }
      });
      
      dialogRef.afterClosed().subscribe((response) => {
        if (response && this.audioQueue.length === 1) {
          this.audioAlert.pause();
          this.playAudio();
        }
      });
    });
  }

  /**
   * Method that opens the dialog box on socket event 
   * @param socketObj 
   */
  openDialog(socketObj: ISocketTemplate) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: socketObj.title,
        message: socketObj.message,
        icon: socketObj.icon,
        confirmBtnText: 'OK',
        dismissBtnText: 'CANCEL',
      }
    });
    this.dialogRefArr.push(dialogRef);
    dialogRef.afterClosed().subscribe(response => {
      this.audioAlert.pause();
      this.audioQueue.pop();
      if (this.audioQueue.length) this.playAudio();

      // emit the broadcast msg only from the tab on which action is taken [ok or cancel]
      if (response !== undefined) {
        this.dialogChannel.postMessage({closeDialog: true});
        this.dialogRefArr.pop();
      }
      if (response) {
        window.open(socketObj.link);
      }
    })
  }

  /**
   * Method that listens to each message emitted by broadcast channel
   * and closes the last dialogRef from the array
   */
  broadCastChannelListener() {
    this.dialogChannel.addEventListener('message', event => {
      if (event.data.closeDialog) {
        this.dialogRefArr.pop()?.close();
      }
    })
  }

  /**
   * Method that sends websocket 'connect_error' data using API
   * @param error 
   * @returns 
   */
  //  createLog(error: any): Observable<any> {
  //   const data = {};
  //   let decoded: any;
  //   if (localStorage.getItem('token')) {
  //     decoded = jwt_decode(localStorage.getItem('token'));
  //   }
  //   data['level'] = 'error';
  //   data['user_id'] = decoded?.['id'];
  //   data['user_type'] = decoded?.['user_type'];
  //   data['client_app'] = 'admin_dashboard';
  //   data['code'] = 101;
  //   data['message'] = error['message'].substring(0, 255);
  //   data['data'] = `Error occured in Web-Socket`;
  //   return this.http.post(apiUrls.postClientLog, data).pipe(
  //     map(response => {
  //       return response;
  //     })
  //   )
  // }
}
