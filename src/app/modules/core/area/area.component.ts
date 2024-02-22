import { Component, ElementRef, EventEmitter, HostListener, NgZone, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ConfirmationDialogComponent } from "src/app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { pickRandomPolygonColor } from "src/app/shared/functions/modular.functions";
import { ComponentCanDeactivate } from "src/app/shared/guards/can-deactivate.guard";
import { CityAreaService } from "src/app/shared/services/city-area.service";
import { Area } from "./model/area";

declare const google: any;

@Component({
  selector: "app-area",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
})
export class AreaComponent implements OnInit, ComponentCanDeactivate {
  polygon: any;
  pointList: { lat: number; lng: number }[] = [];
  options: any = {
    lat: 23.2584857,
    lng: 77.401989,
  };
  zoom: number = 12;
  areaLabel = "Area Search";
  addPolygon = false;
  selectedArea = 0;
  areaName: string;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  polygonCreate: boolean;
  cityList = [];
  @Output() closeModal = new EventEmitter<any>();
  viewPolygon: boolean;
  currentViewPolygonDetails: Area;
  viewAllPolygon: boolean;
  currentCityId: string;
  constructor(private ngZone: NgZone, private cityAreaService: CityAreaService, private dialog: MatDialog) {}

  polygonForm = new FormGroup({
    cityId: new FormControl(null,[Validators.required]),
    areaName: new FormControl('',[Validators.required])
  })
  ngOnInit(): void {
    this.setCurrentPosition();
    this.setCityList();
  }

  /**
   * Method that show polygon of created area on map 
   * @param polygon 
   */
  showPolygonInMap(polygon: Area) {
    this.addPolygon = true;
    this.areaLabel = 'View Polygon'
    this.viewPolygon = true;
    this.currentViewPolygonDetails = polygon;
  }

  /**
   * Method that invokes on eventemiiter by area-listing view
   * @param cityId 
   */
  showAllPolygonInMap(cityId: string) {
    this.addPolygon = true;
    this.areaLabel = 'View All Polygon';
    this.viewAllPolygon = true;
    this.currentCityId = cityId;
    
  }

  /**
   * Method that gets all area polygon and sets them in map based on cityid
   * @param map 
   */
  getAllAreaByCityId(map) {
    const data = {
      filter: {
        city_ids: [this.currentCityId]
      }
    }
    this.cityAreaService.postFilterAreaPolygon(data).subscribe(res => {
      for (const c of res['result']) {
        const latLngs = c.coordinates.map(pair => ({lat: pair[0], lng: pair[1]}))

        const coords = new google.maps.Polygon({
          paths: latLngs,
          fillColor: pickRandomPolygonColor(),
          editable: false
        });
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < coords.getPath().getLength(); i++)
          bounds.extend(coords.getPath().getAt(i));
        map.fitBounds(bounds);
        coords.setMap(map);
      }
    })
  }

  /**
   * Method that initializes map configuration
   * @param map 
   * @returns 
   */

  onMapReady(map) {
    if (this.viewPolygon) {
      const latLngs = this.currentViewPolygonDetails.coordinates.map(pair => ({lat: pair[0], lng: pair[1]}))

      const coords = new google.maps.Polygon({
        paths: latLngs,
        fillColor: "#f9b8b8",
        editable: false
      });
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < coords.getPath().getLength(); i++)
        bounds.extend(coords.getPath().getAt(i));
      map.fitBounds(bounds);
      coords.setMap(map);
      return;
    }
    if (this.viewAllPolygon) {
      this.getAllAreaByCityId(map);
      return;
    }
    this.initDrawingManager(map);
    const autocomplete = new google.maps.places.SearchBox(
      this.searchElementRef.nativeElement,
    );
    autocomplete.addListener("places_changed", () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlaces()[0];

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.options.lat = place.geometry.location.lat();
        this.options.lng = place.geometry.location.lng();
        this.zoom = 16
      });
    });
  }

  /**
   * Method that set current geolocation in map of the system
   */

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.options.lat = position.coords.latitude;
        this.options.lng = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }

  /**
   * Method to create / draw polygon on the map
   * @param map 
   */

  initDrawingManager(map: any) {
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
        fillColor: "#f9b8b8",
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };

    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(map);
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        // Polygon drawn
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          this.polygonCreate = true;
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
      },
    );
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(path.getAt(i).toJSON());
    }
  }

  clearSelection(shape) {
    if (this.polygon) {
      shape.setEditable(false);
      this.polygon = null;
      this.pointList = [];
    }
  }
  setSelection(shape) {
    this.deleteSelectedShape();
    this.polygon = shape;
    shape.setEditable(true);
  }

  deleteSelectedShape() {
    if (this.polygon) {
      this.polygon.setMap(null);
      this.selectedArea = 0;
      this.clearSelection(this.polygon);
    }
  }

  /**
   * Method that adds user drawn polygon in maps to selected city
   * by making API call
   */
  savePolygon() {
    if (this.polygonForm.status === 'INVALID') {
      this.polygonForm.markAllAsTouched();
      return;
    }
    const coordinates = []
    for (const t of this.pointList) {
      coordinates.push( Object.values(t));
    }
    const formData = {}
    formData['name']= this.polygonForm.get('areaName').value;
    formData['city_id'] = this.polygonForm.get('cityId').value;
    formData['coordinates'] = coordinates;
    this.cityAreaService.addAreaPolygon(formData).subscribe(
      () => {
        this.polygonForm.reset();
        this.resetAreaPage();
      }
    )
  }

  /**
   * Method that set city list by API call
   */
  setCityList() {
    this.cityAreaService.getCityList().subscribe(
      data => {
        if (data['status'] === true) {
          this.cityList = [];
          for (const c of data['result']) {
            this.cityList.push(c);
          }
        }
      }
    )
  }

   /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    event.stopPropagation();
  }

  /**
   * Method that invokes when there is unsaved changes and user tries
   * to navigate to different route in application
   * @returns boolean
   */
  canDeactivate(): boolean | Observable<boolean> {
    if(this.polygonCreate)
    {
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
    else
    {
      return true;
    }
  }

  /**
   * Method that invokes when user clicks on cancel button
   */
  close(){
    this.closeModal.emit();
  }

  /**
   * Method that resets the area page
   */
  resetAreaPage(){
    this.addPolygon = !this.addPolygon;
    this.polygonCreate = false;
    this.areaLabel = "Area Search";
    this.viewPolygon = false;
    this.viewAllPolygon = false;
  }

  /**
   * Method that navigate to area table page from add polygon page
   */
  navigateToAreaTable(){
    if(this.polygonCreate){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure ?',
          message: 'Unsaved data will be lost. You want to continue ?',
          confirmBtnText: 'OK',
          dismissBtnText: 'Cancel'
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        response ? this.resetAreaPage() : this.close();
      })
    }
    else{
      this.resetAreaPage();
    }
  }
}


