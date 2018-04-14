import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];

  constructor(public navCtrl: NavController, public platform: Platform, private geolocation: Geolocation) {
    // platform.ready().then(() => {
    //   this.initMap();
    // });
  }
  ionViewDidLoad(){
    this.initMap();
  }

  initMap() {
    // let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    // let mapOptions = {
    //   center: latLng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }
 
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });


    // this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
    //   let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
    //   this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //     zoom: 15,
    //     center: mylocation
    //   });
    // });
    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.deleteMarkers();
    //   let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
    //   let image = 'assets/imgs/blue-bike.png';
    //   this.addMarker(updatelocation,image);
    //   this.setMapOnAll(this.map);
    // });
  }
  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

}
