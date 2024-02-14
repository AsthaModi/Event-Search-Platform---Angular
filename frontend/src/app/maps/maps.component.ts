import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent {
  
  a = Number(this.data.lat);
  b = Number(this.data.lon);
  mapOptions: google.maps.MapOptions = {
    center: { lat:this.a, lng: this.b },
    zoom: 14
  }
  marker = {
    position: { lat: this.a, lng: this.b },
  }
  constructor(public dialogRef: MatDialogRef<MapsComponent>, @Inject(MAT_DIALOG_DATA) public data: any){}
}
