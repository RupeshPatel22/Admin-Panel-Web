import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pickRandomPolygonColor } from 'src/app/shared/functions/modular.functions';
import { ComponentCanDeactivate } from 'src/app/shared/guards/can-deactivate.guard';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BlackZone } from '../black-zone/model/black-zone';
import { OperationalZone } from '../operational-zone/model/operational-zone';
import { IOpCityEventEmitter, OpCityAction, OperationalCity } from './model/operational-city';

@Component({
  selector: 'app-operational-city',
  templateUrl: './operational-city.component.html',
  styleUrls: ['./operational-city.component.scss']
})
export class OperationalCityComponent implements OnInit, ComponentCanDeactivate {


  polygonAction: OpCityAction;
  cityDetails: OperationalCity
  pageHeading: string;
  lat: number = 21.1458;
  long: number = 79.0882;
  zoom: number = 12;
  polygon: any;
  isPolygonDrawn: boolean;
  showMapForPolygon: boolean = false;
  pointList: { lat: number; lng: number }[] = [];
  map: google.maps.Map;
  @ViewChild("search")
  public searchElementRef: ElementRef;

  polygonForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })
  constructor(private ngZone: NgZone, private riderService: RiderService, private toastMsgService: ToastService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /**
   * Method that initializes map configuration
   * @param map 
   * @returns 
   */

  onMapReady(map: google.maps.Map) {
    this.map = map;
    if (this.polygonAction !== 'Create') this.setEditableOrViewablePolygonOnMap();
    if (this.polygonAction === 'Create' || this.polygonAction === 'Edit') this.initDrawingManager();
    if (this.polygonAction === 'View All') {
      this.getAllOpZonesByCityId();
      this.getAllBlackZonesByCityId();
    }
    const autocomplete = new google.maps.places.SearchBox(
      this.searchElementRef.nativeElement,
    );
    autocomplete.addListener("places_changed", () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlaces()[0];

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.lat = place.geometry.location.lat();
        this.long = place.geometry.location.lng();
        this.zoom = 16
      });
    });
  }
  /**
   * Method that city-polygon in a map in edit or view mode
   * here city-polygon is something which is emitted by listng-view
   * @param map 
   */
  setEditableOrViewablePolygonOnMap() {
    const poly = new google.maps.Polygon({
      paths: this.cityDetails.polygon,
      fillColor: this.polygonAction === 'View All' ? "#fff" : "#f9b8b8",
      draggable: this.polygonAction === 'Edit',
      editable: this.polygonAction === 'Edit'
    });
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < poly.getPath().getLength(); i++)
      bounds.extend(poly.getPath().getAt(i));
    this.map.fitBounds(bounds);
    poly.setMap(this.map);
    this.polygon = poly;
    google.maps.event.addListener(poly.getPath(), "set_at", () => {
      this.isPolygonDrawn = true;
      this.updatePointList(poly.getPath());
    });
    google.maps.event.addListener(poly.getPath(), "insert_at", () => {
      this.isPolygonDrawn = true;
      this.updatePointList(poly.getPath());
    });
    google.maps.event.addListener(poly.getPath(), "remove_at", () => {
      this.isPolygonDrawn = true;
      this.updatePointList(poly.getPath());
    });
  }

  /**
   * Method that gets all op zones by city id
   * and set all zone-polygons in a map
   */
  getAllOpZonesByCityId() {
    const data = {
      filter: {
        operational_city_id: [this.cityDetails.id],
        is_deleted: false
      }
    }
    this.riderService.filterOperationalZone(data).subscribe(res => {
      for (const record of res['result']['records']) {
        const zone = OperationalZone.fromJson(record);
        const poly = new google.maps.Polygon({
          paths: zone.polygon,
          fillColor: pickRandomPolygonColor(),
        });
        this.addInfoWindow(zone, poly);
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < poly.getPath().getLength(); i++)
          bounds.extend(poly.getPath().getAt(i));
        this.map.fitBounds(bounds);
        poly.setMap(this.map);
      }
    })
  }

  /**
  * Method that gets all black zones by city id
  * and set all black-zone-polygons in a map
  */
  getAllBlackZonesByCityId() {
    const data = {
      filter: {
        operational_city_id: [this.cityDetails.id],
        is_deleted: false
      }
    }
    this.riderService.filterBlackZone(data).subscribe(res => {

      // Set polygons of the zones
      for (const record of res['result']['records']) {
        const zone = BlackZone.fromJson(record)
        const poly = new google.maps.Polygon({
          paths: zone.polygon,
          fillColor: '#000',
        });
        this.addInfoWindow(zone, poly, true);
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < poly.getPath().getLength(); i++)
          bounds.extend(poly.getPath().getAt(i));
        this.map.fitBounds(bounds);
        poly.setMap(this.map);
      }
    })
  }

  /**
   * Method that adds info-window in polygon
   * @param zone 
   * @param poly 
   */
  addInfoWindow(zone: OperationalZone | BlackZone, poly: google.maps.Polygon, isBlackZone?: boolean) {
    const latSum = zone.polygon.reduce((sum, coord) => sum + coord.lat, 0);
    const lngSum = zone.polygon.reduce((sum, coord) => sum + coord.lng, 0);
    const numCoords = zone.polygon.length;
    const position = { lat: latSum / numCoords, lng: lngSum / numCoords };

    const infoWindow = new google.maps.InfoWindow({ 
      content: `<b>${zone.name} ${isBlackZone ? '(Black Zone)' : ''}</b>`,
      position 
    });
    infoWindow.open(this.map);
    poly.addListener('click', (e) => {
      infoWindow.setPosition(e.latLng);
      infoWindow.open(this.map);
    });
  }

  /**
   * Method to create / draw polygon on the map
   * @param map 
   */

  initDrawingManager() {
    const options: google.maps.drawing.DrawingManagerOptions = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
        fillColor: "#f9b8b8",
      },
      drawingMode: this.polygonAction === 'Create' ? google.maps.drawing.OverlayType.POLYGON : null,
    };

    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(this.map);
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        // Polygon drawn
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          this.isPolygonDrawn = true;
          const paths = event.overlay.getPaths();
          this.setSelection(event.overlay);
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(paths.getAt(p), "set_at", () => {
              if (!event.overlay.drag) {
                this.updatePointList(event.overlay.getPath());
              }
            });
            google.maps.event.addListener(paths.getAt(p), "insert_at", () => {
              this.updatePointList(event.overlay.getPath());
            });
            google.maps.event.addListener(paths.getAt(p), "remove_at", () => {
              this.updatePointList(event.overlay.getPath());
            });
          }
          this.updatePointList(event.overlay.getPath());
        }
        // once polygon is drawn setting drawing mode to null. 
        drawingManager.setDrawingMode(null);
      },
    );
  }

  /**
   * Method that updates polygon coords on completion of polygon creation
   * @param path 
   */
  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(path.getAt(i).toJSON());
    }
    this.pointList.push(this.pointList[0]);
  }

  /**
   * Method that clears existing shape
   * @param shape 
   */
  clearSelection(shape) {
    if (this.polygon) {
      shape.setEditable(false);
      this.polygon = null;
      this.pointList = [];
    }
  }

  /**
   * Method that set polygon selection
   * @param shape 
   */
  setSelection(shape) {
    this.deleteSelectedShape();
    this.polygon = shape;
    shape.setEditable(true);
  }

  /**
   * Method that deletes created polygon
   */
  deleteSelectedShape() {
    if (this.polygon) {
      this.polygon.setMap(null);
      this.clearSelection(this.polygon);
    }
  }

  /**
  * Method that sets few values when map-view is opened and listing-view is closed
  * @param event 
  */
  initialiseMapDetails(event: IOpCityEventEmitter) {
    this.showMapForPolygon = true;
    this.polygonAction = event.action;
    this.cityDetails = event.cityDetails;
    this.pageHeading = `${this.polygonAction} City Polygon`;
    this.polygonForm.patchValue({ ...this.cityDetails });
    if (this.polygonAction === 'View' || this.polygonAction === 'View All') this.polygonForm.disable();
  }

  /**
   * Method that resets few values when map-view is closed and listing-view is opened
   */
  resetMapDetails() {
    this.showMapForPolygon = false;
    this.isPolygonDrawn = false;
    this.polygonForm.enable();
    this.polygonForm.reset();
  }

  /**
   * Method that add/edit polygon
   * @returns 
   */
  submitPolygon() {
    if (this.polygonForm.status === 'INVALID') {
      this.polygonForm.markAllAsTouched();
      return
    }
    if (this.polygonAction === 'Create' && !this.isPolygonDrawn) {
      this.toastMsgService.showError('Please create polygon to continue');
      return;
    }
    const data = this.toJson();
    if (this.polygonAction === 'Create') {
      this.riderService.createOperationalCity(data).subscribe(res => {
        this.toastMsgService.showSuccess('city is created successfully');
        this.resetMapDetails();
      })
    }
    if (this.polygonAction === 'Edit') {
      this.riderService.updateOperationalCity(this.cityDetails.id, data).subscribe(res => {
        this.toastMsgService.showSuccess('city is updated successfully');
        this.resetMapDetails();
      })
    }
  }

  /**
   * Method that returns data in the format that will be sent through api
   * @returns 
   */
  toJson() {
    const data = {};
    data['name'] = this.polygonForm.get('name').value;
    data['status'] = 'enable';
    data['polygon'] = this.pointList.length 
      ? this.pointList.map(pair => ({ latitude: pair.lat, longitude: pair.lng }))
      : this.cityDetails.polygon.map(pair => ({ latitude: pair.lat, longitude: pair.lng }));
    return data;
  }

  /**
  * Method that close map-view and open listing-view
  * @returns 
  */
  closeMapView() {
    if (!this.isPolygonDrawn) return this.resetMapDetails();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: 'Unsaved data will be lost. You want to continue ?',
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });

    return dialogRef.afterClosed().subscribe(response => {
      if (response) this.resetMapDetails();
    })
  }

  /**
   * Method that invokes when there is unsaved changes and user tries
   * to navigate to different route in application
   * @returns boolean
   */
  canDeactivate(): boolean | Observable<boolean> {
    if (this.isPolygonDrawn) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure ?',
          message: 'Unsaved data will be lost. You want to continue ?',
          confirmBtnText: 'OK',
          dismissBtnText: 'Cancel'
        }
      });

      return dialogRef.afterClosed().pipe(map(choice => {
        return choice;
      }));
    }
    else {
      return true;
    }
  }

  /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    if (this.isPolygonDrawn) event.stopPropagation();
  }
}
