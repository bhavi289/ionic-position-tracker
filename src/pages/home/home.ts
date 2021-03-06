import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, ToastController, } from 'ionic-angular';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  login: {ph_number?: string, password?: string} = {};

  position: { lat?: any, lng?: any } = {};

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  lat: any;
  lng: any;
  markers = [];
  ref = firebase.database().ref('geolocations/');

  constructor(public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    private device: Device,
    public toastCtrl: ToastController
  ) {
    platform.ready().then(() => {
      this.initMap();
    });
    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if(data.uuid !== this.device.uuid) {
          let image = 'assets/imgs/green-bike.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/blue-bike.png';
          this.position.lat = data.latitude;
          this.position.lng = data.longitude;  
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        }
      });
    });
  }

  latLng() {
    var options = {
      enableHighAccuracy: true
    };

  this.geolocation.getCurrentPosition(options)
  .then((position) => {
      console.log('Geolocation successful');

      // this.currentLocation = {
          this.lat= position.coords.latitude,
          this.lng= position.coords.longitude
      // };

      // let query = '?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude;

      // this.updatePlaces(query);

    })
  }

  initMap() {
    // this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //   zoom: 7,
    //   center: {lat: 41.85, lng: -87.65}
    // });
    this.showToast("Inside initMap");          
    this.geolocation.getCurrentPosition().then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.position.lat = resp.coords.latitude;
      this.position.lng = resp.coords.longitude;      
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.showToast("Started,"+this.lat+" "+this.lng);      
      
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.showToast("Changing,"+this.lat+" "+this.lng);            
      this.deleteMarkers();
      this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      let image = 'assets/imgs/blue-bike.png';
      this.addMarker(updatelocation,image);
      this.setMapOnAll(this.map);
    });
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

  updateGeolocation(uuid, lat, lng) {
    this.showToast("updating geolocation on firebase");                
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

  showToast(response_message:any)
    {
        let toast = this.toastCtrl.create({
            duration: 1000
        });
        toast.present();
    }

}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};
