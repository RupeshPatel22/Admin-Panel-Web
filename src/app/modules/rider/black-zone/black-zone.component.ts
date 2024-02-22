import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { OperationalCity } from '../operational-city/model/operational-city';
import { BlackZone, BlackZoneAction, BlackZoneDurationType, IBlackZoneEventEmitter } from './model/black-zone';

@Component({
  selector: 'app-black-zone',
  templateUrl: './black-zone.component.html',
  styleUrls: ['./black-zone.component.scss']
})
export class BlackZoneComponent implements OnInit {

  polygonAction: BlackZoneAction;
  zoneDetails: BlackZone;
  pageHeading: string;
  opCityList: OperationalCity[];
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
  readonly blackZoneDurationType = BlackZoneDurationType;

  polygonForm = new FormGroup({
    opCityId: new FormControl(null, [Validators.required]),
    durationType: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('',[Validators.required]),
  })
  constructor(private ngZone: NgZone, private riderService: RiderService, private toastMsgService: ToastService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOperationalCities();
  }

  /**
   * Method that gets all city list
   */
   getOperationalCities() {
    const data = {
      filter: {}
    }
    this.riderService.filterOperationalCity(data).subscribe(res => {
      this.opCityList = [];
      for (const i of res['result']['records']) {
        this.opCityList.push(OperationalCity.fromJson(i));
      }
    })
  }

  /**
   * Method that initializes map configuration
   * @param map 
   * @returns 
   */

  onMapReady(map: google.maps.Map) {
    this.map = map
    if (this.polygonAction === 'Edit' || this.polygonAction === 'View') {
      this.setEditableOrViewablePolygonOnMap()

    }
    if (this.polygonAction === 'Create' || this.polygonAction === 'Edit') this.initDrawingManager();
    if (this.polygonAction === 'View All' || this.polygonAction === 'Edit') this.getAllBlackZonesByCityId();
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
   * Method that zone-polygon in a map in edit or view mode
   * here zone-polygon is something which is emitted by listng-view
   * @param map 
   */
  setEditableOrViewablePolygonOnMap() {

    const poly = new google.maps.Polygon({
      paths: this.zoneDetails.polygon,
      fillColor: "#000",
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
   * Method that gets all zones by city id
   * and set all zone-polygons in a map
   * @param map 
   */
   getAllBlackZonesByCityId() {
    const opCityId = this.polygonAction === 'Create' ? this.polygonForm.get('opCityId').value : this.zoneDetails.opCityId;
    const data = {
      filter: {
        operational_city_id: [opCityId],
        is_deleted: false
      }
    }
    this.riderService.filterBlackZone(data).subscribe(res => {
      // Set polygon of city
      const index = this.opCityList.findIndex(record => record.id === opCityId);

      const poly = new google.maps.Polygon({
        paths: this.opCityList[index].polygon,
        fillColor: '#fff',
      });
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < poly.getPath().getLength(); i++)
        bounds.extend(poly.getPath().getAt(i));
      this.map.fitBounds(bounds);
      poly.setMap(this.map);

      // Set polygons of the zones
      for (const record of res['result']['records']) {
        const zone = BlackZone.fromJson(record)
        if (this.polygonAction === 'Edit' && this.zoneDetails['id'] === zone['id']) continue;

        const poly = new google.maps.Polygon({
          paths: zone.polygon,
          fillColor: '#000',
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
   * Method that adds info-window in polygon
   * @param zone 
   * @param poly 
   */
  addInfoWindow(zone: BlackZone, poly: google.maps.Polygon) {
    const latSum = zone.polygon.reduce((sum, coord) => sum + coord.lat, 0);
    const lngSum = zone.polygon.reduce((sum, coord) => sum + coord.lng, 0);
    const numCoords = zone.polygon.length;
    const position = { lat: latSum / numCoords, lng: lngSum / numCoords };

    const infoWindow = new google.maps.InfoWindow({ content: `<b>${zone.name}</b>`, position });
    infoWindow.open(this.map);
    poly.addListener('click', (e) => {
      infoWindow.setPosition(e.latLng);
      infoWindow.open(this.map);
    });
  }

  /**
   * Method to create / draw polygon on the map 
   */

  initDrawingManager() {
    const options: google.maps.drawing.DrawingManagerOptions = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        fillColor: "#000",
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
  initialiseMapDetails(event: IBlackZoneEventEmitter) {
    this.showMapForPolygon = true;
    this.polygonAction = event.action;
    this.zoneDetails = event.zoneDetails;
    this.pageHeading = `${this.polygonAction} Black Zone Polygon`;
    this.polygonForm.patchValue({ ...this.zoneDetails });
    if (this.polygonAction === 'Edit') {
      this.polygonForm.get('opCityId').disable();
      this.polygonForm.get('durationType').disable();
    }
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
      this.riderService.createBlackZone(data).subscribe(res => {
        this.toastMsgService.showSuccess('zone is created successfully');
        this.resetMapDetails();
      })
    }
    if (this.polygonAction === 'Edit') {
      this.riderService.updateBlackZone(this.zoneDetails.id, data).subscribe(res => {
        this.toastMsgService.showSuccess('zone is updated successfully');
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
    if (this.polygonAction === 'Create') {
      data['operational_city_id'] = this.polygonForm.get('opCityId').value;
      data['duration_type'] = this.polygonForm.get('durationType').value;
    }
    data['name'] = this.polygonForm.get('name').value;
    data['status'] = 'enable';
    
    data['description'] = this.polygonForm.get('description').value || undefined;
    data['polygon'] = this.pointList.length 
      ? this.pointList.map(pair => ({ latitude: pair.lat, longitude: pair.lng }))
      : this.zoneDetails.polygon.map(pair => ({ latitude: pair.lat, longitude: pair.lng }));
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
