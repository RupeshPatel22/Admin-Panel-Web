import { LatLngBounds } from '@agm/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { pickRandomPolygonColor } from 'src/app/shared/functions/modular.functions';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BlackZone } from '../black-zone/model/black-zone';
import { OperationalCity } from '../operational-city/model/operational-city';
import { OperationalZone } from '../operational-zone/model/operational-zone';
import { RiderStatusList } from '../rider-lists/model/rider-lists';
import { RiderTracking } from './model/live-tracking';

@Component({
  selector: 'app-live-tracking',
  templateUrl: './live-tracking.component.html',
  styleUrls: ['./live-tracking.component.scss']
})
export class LiveTrackingComponent implements OnInit, OnDestroy {

  centerLatitude: number;
  centerLongitude: number;
  mapLatitude: number = 19.070170265541183;
  mapLongitude: number = 72.88072022812501;
  filterByRiderCount: number = 100;
  radius: number;
  filterByRiderStatus: string[] = ['idle', 'allocating', 'busy'];
  riderTrackingList: RiderTracking[] = [];
  readonly riderStatusList = RiderStatusList;
  idleRiderCount: number;
  allocatingRiderCount: number;
  busyRiderCount: number;
  showRiderCount: boolean;
  interval: any;
  opZonePolygons: { poly: google.maps.Polygon, infoWindow: google.maps.InfoWindow }[] = [];
  blackZonePolygons: { poly: google.maps.Polygon, infoWindow: google.maps.InfoWindow }[] = [];
  showOpZonePolygons: boolean = true;
  showBlackZonePolygons: boolean = true;
  map: google.maps.Map;
  constructor(private riderService: RiderService, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    // Set Nagpur coordinates as default
    this.mapLatitude = 21.1458;
    this.mapLongitude = 79.0882;
    // this.setCurrentPosition();
    this.interval = setInterval(() => {
      this.getLiveTracking();
    }, 30000)
  }

  /**
   * Method that invokes when map is initialized
   * @param map 
   */
  onMapReady(map: google.maps.Map) {
    this.map = map;
    this.getOpCities();
    this.getOpZones();
    this.getBlackZones();
  }

  /**
   * Method that invokes when there is a change in map boundaries
   * @param bounds 
   */
  onBoundsChange(bounds: google.maps.LatLngBounds) {
    const northEast = bounds.getNorthEast()
    const southWest = bounds.getSouthWest()
    const diagonalDistance = google.maps.geometry.spherical.computeDistanceBetween(northEast, southWest);
    let radius = diagonalDistance / 2000; // distance is in mtrs so dividing by 2*1000 to get radius in kms
    if (radius < 2) radius = 2;
    this.radius = Math.floor(radius);

    const center = bounds.getCenter();
    this.centerLatitude = center.lat();
    this.centerLongitude = center.lng();
  }

  /**
   * Method that gets live location of riders
   * @returns 
   */
  getLiveTracking() {
    this.showRiderCount = true;
    if (!this.filterByRiderStatus.length) return this.toastMsgService.showWarning('Select atleast 1 status to continue');
    if (!this.filterByRiderCount) return this.toastMsgService.showWarning('Enter Max Riders to continue');
    const data = {
      status: this.filterByRiderStatus,
      radius: this.radius,
      latitude: this.centerLatitude,
      longitude: this.centerLongitude,
      max_riders: this.filterByRiderCount
    }
    this.riderService.filterRiderLocation(data).subscribe(res => {
      this.riderTrackingList = [];
      this.idleRiderCount = this.allocatingRiderCount = this.busyRiderCount = 0;
      if (res['result']['idle']) {
        for (const i of res['result']['idle']) {
          this.riderTrackingList.push(RiderTracking.fromJson(i));
          this.idleRiderCount++;
        }
      }
      if (res['result']['allocating']) {
        for (const a of res['result']['allocating']) {
          this.riderTrackingList.push(RiderTracking.fromJson(a));
          this.allocatingRiderCount++;
        }
      }
      if (res['result']['busy']) {
        for (const b of res['result']['busy']) {
          this.riderTrackingList.push(RiderTracking.fromJson(b));
          this.busyRiderCount++;
        }
      }
    })
  }

  /**
   * Method that gets all cities
   * and set all city-polygons in a map
  */
  getOpCities() {
    const data = {
      filter: {
        is_deleted: false
      }
    }
    this.riderService.filterOperationalCity(data).subscribe(res => {
      for (const city of res['result']['records']) {
        this.setPolygons(OperationalCity.fromJson(city), 'op-city');
      }
      this.map.setCenter({ lat: this.mapLatitude, lng: this.mapLongitude });
      this.map.setZoom(12);
    })
  }

  /**
   * Method that gets all zones
   * and set all zone-polygons in a map
   */
  getOpZones() {
    const data = {
      filter: {
        is_deleted: false
      }
    }
    this.riderService.filterOperationalZone(data).subscribe(res => {
      for (const zone of res['result']['records']) {
        this.setPolygons(OperationalZone.fromJson(zone), 'op-zone');
      }
      this.map.setCenter({ lat: this.mapLatitude, lng: this.mapLongitude });
      this.map.setZoom(12);
    })
  }

  /**
  * Method that gets all black zones
  * and set all black-zone-polygons in a map
  */
  getBlackZones() {
    const data = {
      filter: {
        is_deleted: false,
        status: ["enable"]
      }
    }
    this.riderService.filterBlackZone(data).subscribe(res => {
      for (const zone of res['result']['records']) {
        this.setPolygons(BlackZone.fromJson(zone), 'black-zone');
      }
      this.map.setCenter({ lat: this.mapLatitude, lng: this.mapLongitude });
      this.map.setZoom(12)
    })
  }

  /**
   * Method that sets polygons in a map
   * @param polygonDet 
   * @param type 
   */
  setPolygons(polygonDet: OperationalCity | OperationalZone | BlackZone, type: 'op-city' | 'op-zone' | 'black-zone') {
    let fillColor: string;
    if (type === 'op-city') fillColor = '#fff';
    if (type === 'op-zone') fillColor = pickRandomPolygonColor();
    if (type === 'black-zone') fillColor = '#000';
    const poly = new google.maps.Polygon({
      paths: polygonDet.polygon,
      fillColor
    });
    if (type !== 'op-city') this.addInfoWindow(polygonDet, poly, type);
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < poly.getPath().getLength(); i++)
      bounds.extend(poly.getPath().getAt(i));
    this.map.fitBounds(bounds);
    poly.setMap(this.map);

  }

  /**
  * Method that adds info-window in polygon
  * @param zone 
  * @param poly 
  */
  addInfoWindow(zone: OperationalCity | OperationalZone | BlackZone, poly: google.maps.Polygon, type: 'op-city' | 'op-zone' | 'black-zone') {
    const latSum = zone.polygon.reduce((sum, coord) => sum + coord.lat, 0);
    const lngSum = zone.polygon.reduce((sum, coord) => sum + coord.lng, 0);
    const numCoords = zone.polygon.length;
    const position = { lat: latSum / numCoords, lng: lngSum / numCoords };

    const infoWindow = new google.maps.InfoWindow({
      content: `<b>${zone.name} ${type === 'black-zone' ? '(Black Zone)' : ''}</b>`,
      position
    });
    poly.addListener('click', (e) => {
      infoWindow.setPosition(e.latLng);
      infoWindow.open(this.map);
    });
    // storing all polygons and infowindow in a varible. and it will be used to show/hide based on user selection
    if (type === 'op-zone') this.opZonePolygons.push({ poly, infoWindow });
    if (type === 'black-zone') this.blackZonePolygons.push({ poly, infoWindow });
  }

  /**
   * Method that shows op-zone polygons based on user selection
   */
  toggleOpZonePolygons() {
    if (this.showOpZonePolygons) {
      this.opZonePolygons.forEach(item => {
        item.poly.setVisible(false);
        item.infoWindow.close();
      })
    }
    else {
      this.opZonePolygons.forEach(item => item.poly.setVisible(true));
    }
    this.showOpZonePolygons = !this.showOpZonePolygons;
  }

  /**
   * Method that show black-zone polygons based on user selection
   */
  toggleBlackZonePolygons() {
    if (this.showBlackZonePolygons) {
      this.blackZonePolygons.forEach(item => {
        item.poly.setVisible(false);
        item.infoWindow.close();
      })
    }
    else {
      this.blackZonePolygons.forEach(item => item.poly.setVisible(true))
    }
    this.showBlackZonePolygons = !this.showBlackZonePolygons;
  }

  /**
   * Method that sets current location in map
   */
  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mapLatitude = position.coords.latitude;
        this.mapLongitude = position.coords.longitude;
      });
    }
  }

  /**
   * Method that change color of map marker based on rider status
   * @param status 
   * @returns response
   */
  getMarkerIcon(status: string): string {
    switch (status) {
      case 'idle':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'busy':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'allocating':
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png';
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
