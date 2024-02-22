import { Filter, OperationalCities,  OperationalZone, } from './model/live-statistics';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RiderService } from 'src/app/shared/services/rider.service';
import { Subscription } from 'rxjs';
import { pageSize, pageSizeOptions, Services } from 'src/app/shared/models/constants/constant.type';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { pickRandomPolygonColor } from 'src/app/shared/functions/modular.functions';

@Component({
  selector: 'app-live-statistics',
  templateUrl: './live-statistics.component.html',
  styleUrls: ['./live-statistics.component.scss']
})
export class LiveStatisticsComponent implements OnInit, OnDestroy {
  liveStatistics: MatTableDataSource<OperationalZone> = new MatTableDataSource();
  displayedColumns: string[] = ['zoneId', 'liveRiders', 'liveOrders', 'currentBannerFactor',  'bannerFactorLowerLimit', 'bannerFactorUpperLimit', 'bannerFactorCoolDownSince'];
  operationalCities: OperationalCities [] = [];
  operationalCity: OperationalCities[] = [];
  operationalZone: OperationalZone [] = [];
  // pageIndex: number = 0;
  // pageSize: number = pageSize;
  // pageSizeOptions = this.getPageSizeOptions;
  showMap: boolean;
  showByDefaultCity: number[] =[];
  showZone: number[] = [];
  mapLatitude: number = 19.070170265541183;
  mapLongitude: number = 72.88072022812501;
  map: google.maps.Map;
  centerLatitude: number;
  centerLongitude: number;
  radius: number;
  interval: any;
  cityMap: any;
  zonePolygon: { id:number, poly: google.maps.Polygon, infoWindow: google.maps.InfoWindow }[] = [];
  @ViewChild(MatSort) sort: MatSort;
  private subscription: Subscription;
  filter: Filter = new Filter();
 
  constructor(private riderService: RiderService) { }

  ngOnInit(): void {
    this.mapLatitude = 21.1458;
    this.mapLongitude = 79.0882;
  }

 /**
 * Callback function invoked when the Google Map is ready.
 * @param map - The Google Map instance.
 */
onMapReady(map: google.maps.Map): void {
  this.map = map;
  this.interval = setInterval(() => {
    this.postLiveStatistics();
  }, 30000);
  this.postLiveStatistics(true)
}


/**
 * Posts live statistics to the server and optionally sets a default city.
 * @param setDefaultCity - A boolean indicating whether to set the default city to 'Nagpur'.
 */
postLiveStatistics(setDefaultCity?: boolean): void {
  const data = this.filter.toJson();

  this.subscription = this.riderService.postLiveStatistics(data).subscribe(
    (res) => {
      this.operationalCities = [];

      for (const i of res.result.operational_cities) {
        if (setDefaultCity && i.name.toLowerCase().includes('nagpur')) {
          this.filter.operationalCityId = i.id;
          this.setZoneList(OperationalCities.fromJson(i));
        }
        if (setDefaultCity) {
          this.operationalCity = this.operationalCities;
        }
        this.operationalCities.push(OperationalCities.fromJson(i));
      }
      const selectedCity = this.operationalCities.find(city => city.id === this.filter.operationalCityId);
      this.liveStatistics.data = selectedCity.operationalZones;
    },
  );
}


  /**
 * Sets the operational zone list and updates the live statistics data and polygon based on the selected OperationalCities.
 * @param select - The selected OperationalCities object.
 */
  setZoneList(select:OperationalCities){
    if (!select) return
    this.operationalZone= select.operationalZones;
    this.liveStatistics.data = select?.operationalZones;
    this.liveStatistics.sort = this.sort;
    this.filter.operationalZoneId = null;
    this.setPolygon(select);
  }

  /**
 * Sets and displays operational zones based on the selected zones and updates the live statistics data and map polygons accordingly.
 * @param select - An array of selected OperationalZone objects.
 */
setZone(select: OperationalZone[]): void {
  // Check if no zone is selected (select array is empty)
  if (select.length === 0) {
    // Show all zones in liveStatistics
    this.liveStatistics.data = this.operationalZone;
    
    // Show all zones on the map
    this.zonePolygon.forEach(item => {
      item.infoWindow.open(this.map, item.poly);
      item.poly.setVisible(true);
    });
  } else {
    // Filter and show selected zones in liveStatistics
    this.liveStatistics.data = select;
    
    // Iterate through all zones
    this.zonePolygon.forEach(item => {
      // Check if the zone's ID is in the selectedZoneIds array
      const isSelected = select.some(zone => zone.id === item.id);

      // Close info window and toggle polygon visibility based on selection
      if (isSelected) {
        item.infoWindow.open(this.map, item.poly);
        item.poly.setVisible(true);
      } else {
        item.infoWindow.close();
        item.poly.setVisible(false);
      }
    });
  }

  this.liveStatistics.sort = this.sort;
}


  /**
 * Creates and displays polygons for the selected city and operational zones on the map.
 * @param select - The selected OperationalCities object containing city and zone polygon data.
 */
setPolygon(select: OperationalCities): void {
  // Create and display the city polygon
  const city = new google.maps.Polygon({
    paths: select.polygon,
    fillColor: '#fff',
  });
  const cityBounds = new google.maps.LatLngBounds();
  for (let i = 0; i < city.getPath().getLength(); i++) {
    cityBounds.extend(city.getPath().getAt(i));
  }
  this.map.fitBounds(cityBounds);
  city.setMap(this.map);
  this.cityMap = city;

  // Create and display polygons for each operational zone
  for (const zone of select.operationalZones) {
    const zonePolygon = new google.maps.Polygon({
      paths: zone.polygon, // Use the zone's specific polygon coordinates
      fillColor: pickRandomPolygonColor(),
    });
    this.addInfoWindow(zone, zonePolygon)
    const zoneBounds = new google.maps.LatLngBounds();
    for (let i = 0; i < zonePolygon.getPath().getLength(); i++) {
      zoneBounds.extend(zonePolygon.getPath().getAt(i));
    }
    this.map.fitBounds(zoneBounds);
    zonePolygon.setMap(this.map);
    this.map.setZoom(12)
  }
}

  /**
 * Adds an info window to a polygon on the map and associates it with the given operational zone.
 * @param zone - The operational zone to which the info window is associated.
 * @param poly - The polygon to which the info window is added.
 */
addInfoWindow(zone: OperationalZone, poly: google.maps.Polygon): void {
  // Calculate the average position for the info window
  const latSum = zone.polygon.reduce((sum, coord) => sum + coord.lat, 0);
  const lngSum = zone.polygon.reduce((sum, coord) => sum + coord.lng, 0);
  const numCoords = zone.polygon.length;
  const position = { lat: latSum / numCoords, lng: lngSum / numCoords };

  const infoWindow = new google.maps.InfoWindow({ 
    content: `<b>${zone.name}</b>`,
    position 
  });
  infoWindow.open(this.map);

  // Add a click listener to the polygon to show the info window
  poly.addListener('click', (e) => {
    infoWindow.setPosition(e.latLng);
    infoWindow.open(this.map);
  });

  // Store the polygon and associated info window
  this.zonePolygon.push({ id: zone.id, poly, infoWindow });
}


 /**
 * Handles the change of map bounds and updates the radius and center coordinates based on the new bounds.
 * @param bounds - The new map bounds as a LatLngBounds object.
 */
onBoundsChange(bounds: google.maps.LatLngBounds): void {
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();
  const diagonalDistance = google.maps.geometry.spherical.computeDistanceBetween(northEast, southWest);
  let radius = diagonalDistance / 2000; // Distance is in meters, so dividing by 2*1000 to get radius in kilometers

  // Ensure a minimum radius of 2 kilometers
  if (radius < 2) {
    radius = 2;
  }

  // Set the radius as an integer
  this.radius = Math.floor(radius);

  // Get the center coordinates
  const center = bounds.getCenter();
  this.centerLatitude = center.lat();
  this.centerLongitude = center.lng();
}

  /**
   * Method that returns different pageSizeOptions
   */
  // get getPageSizeOptions(): number[] {
  //   return pageSizeOptions;
  // }
 
    /**
* Method that navigates to operational zone page based on operational zone id clicked
* @param operationZoneId 
*/
navigateToOperationalZonePage(operationZoneId: string) {
  window.open(`/rider/operational-zone?operationalZoneId=${operationZoneId}`, '_blank');
}

  ngOnDestroy(): void {
    this.interval = clearInterval(this.interval)
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
