import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConnectionService } from '../connection.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapsComponent } from '../maps/maps.component';


const backIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" >
  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
</svg>`

const spotifyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
<path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>`

const expandMore = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" style="margin-top:29%; margin-left:-42%;"  fill="white"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>`

const expandLess = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" style="margin-top:29%; margin-left:-42%;" fill="white"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>`

const facebookIcon =`<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"/></svg>`

const twitterIcon = `<svg class='fontawesomesvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>`

const heartIcon = `<svg xmlns="http://www.w3.org/2000/svg" style='fill:black;' viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>`

const heartRed = `<svg class='fontawesomesvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  constructor(private connection: ConnectionService, private http: HttpClient, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private dialog: MatDialog) {
    iconRegistry.addSvgIconLiteral('back-icon', sanitizer.bypassSecurityTrustHtml(backIcon));
    iconRegistry.addSvgIconLiteral('spotify-icon', sanitizer.bypassSecurityTrustHtml(spotifyIcon));
    iconRegistry.addSvgIconLiteral('expandmore-icon', sanitizer.bypassSecurityTrustHtml(expandMore));
    iconRegistry.addSvgIconLiteral('expandless-icon', sanitizer.bypassSecurityTrustHtml(expandLess));
    iconRegistry.addSvgIconLiteral('fb-icon', sanitizer.bypassSecurityTrustHtml(facebookIcon));
    iconRegistry.addSvgIconLiteral('twitter-icon', sanitizer.bypassSecurityTrustHtml(twitterIcon));
    iconRegistry.addSvgIconLiteral('heart-icon', sanitizer.bypassSecurityTrustHtml(heartIcon));
    iconRegistry.addSvgIconLiteral('heart-fill-icon', sanitizer.bypassSecurityTrustHtml(heartRed));
  }

  eventListTableFlag: boolean = true;
  keyword = new FormControl('')
  distance = new FormControl('10')
  location = new FormControl('')
  category = new FormControl("KZFzniwnSyZfZ7v7nJ,KZFzniwnSyZfZ7v7nE,KZFzniwnSyZfZ7v7na,KZFzniwnSyZfZ7v7nn,KZFzniwnSyZfZ7v7n1")
  autodetect = new FormControl(false);
  eventList: any;
  eventDetails: any;
  latlong: any;
  lat: any;
  long: any;
  geopoint: any;
  geo_api = "AIzaSyCFN-y7oTXznP2LyLVQhmHSvsvnuFVtJHo";
  a: any;
  k: any;
  d: any;
  c: any;
  l: any;
  kAuto: any;
  isLoading: boolean = false;
  recommendations: any[] = [];
  venueLatMap: any;
  venueLonMap: any;
  eventCardFlag: boolean = false;
  redFlag: boolean = false;

  eventTableDetails: boolean = false;
  TableDetailFlag: boolean = false;

  showLessChildRule: boolean = true;
  showLessGeneralRule: boolean = true;
  showLessOpenHour: boolean = true;
  

  clearForm() {
    // console.log('in clear')
    this.location.setValue('');
    this.location.enable();
    this.keyword.setValue('')
    this.distance.setValue('10')
    this.category.setValue("KZFzniwnSyZfZ7v7nJ,KZFzniwnSyZfZ7v7nE,KZFzniwnSyZfZ7v7na,KZFzniwnSyZfZ7v7nn,KZFzniwnSyZfZ7v7n1")
    this.autodetect.setValue(false)
    this.recommendations = []
    this.TableDetailFlag = false;
    this.eventTableDetails = false;
  }

  toggleShowMoreChildRule() {
    this.showLessChildRule = !this.showLessChildRule;
  }
  toggleShowMoreGeneralRule() {
    this.showLessGeneralRule = !this.showLessGeneralRule;
  }
  toggleShowMoreOpenHour() {
    this.showLessOpenHour = !this.showLessOpenHour;
  }
  back(){
  this.TableDetailFlag = true;
  this.showLessChildRule = true;
  this.showLessGeneralRule = true;
  this.showLessOpenHour = true;
  }
  getSuggestions() {
    this.kAuto = this.keyword.value;
    // connection.search_events
    if (this.kAuto.length > 1) {
      this.isLoading = true;
      this.connection.autocomplete_keyword(this.kAuto)
        .subscribe((dataa) => {
          // console.log(dataa)
          this.recommendations = dataa;
          this.isLoading = false
        });

    }
    else{
      this.recommendations=[]
    }
  }

  autoDetectLocation() {
    if (this.autodetect.value) {
      this.location.disable();
      this.location.setValue('');
    }
    else {
      this.location.enable();
    }
  }

  sendFormData() {
    // console.log('astha Nilesh MOdi')
    this.k = this.keyword.value
    this.d = this.distance.value
    this.l = this.location.value
    this.c = this.category.value

    if(this.k == ''){
      return
    }
    
    if (this.d == '') {
      this.d = 10
    }

    
    // console.log('hghghgh',this.keyword.value)
    if (this.autodetect.value) {
      // console.log("Astha ")
      this.location.disable();
      fetch('https://ipinfo.io/?token=d31988b6018279')
        .then(response => response.json())
        .then(data => {
          this.latlong = data.loc.split(",")
          this.lat = this.latlong[0]
          this.long = this.latlong[1]
          // console.log(this.lat, this.long)
          this.connection.search_events(this.k, this.d, this.c, this.lat, this.long)
            .subscribe((dataa) => {
              // console.log(dataa)
              this.eventTableDetails = true;
              this.TableDetailFlag = true;
              this.eventList = (dataa);
            });
        });
    }

    else {
      if(this.l!=''){
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(this.l)}&key=${this.geo_api}`)
        .then(response => response.json())
        .then(data => {

          // console.log(data['results']['0'])
          if (data['results']['0'])
          {
            this.lat = data['results']['0']['geometry']['location']['lat'];
            this.long = data['results']['0']['geometry']['location']['lng'];
            // console.log('in geolocation', this.lat, this.long)
            this.connection.search_events(this.k, this.d, this.c, this.lat, this.long)
              .subscribe((fData) => {
                this.eventTableDetails = true;
                this.TableDetailFlag = true;
                this.eventList = (fData);
                // console.log(this.eventList)
              });
          }
          
          else { this.eventList = ""
            this.eventTableDetails = true;
            this.TableDetailFlag = true; }
        });
      }
    }
  }

  searchEventDetails(eveId: string) {
    this.connection.get_event_details(eveId).subscribe
      ((data) => {
        this.TableDetailFlag = false;
        this.eventDetails = data;
        let keyLS = JSON.parse(localStorage.getItem('keyLS') || '[]')
        this.redFlag = keyLS.some((a: any) => a.id === this.eventDetails.eventId)
        // console.log('hihhihihi', this.redFlag)
        // console.log(this.eventDetails);
        this.eventListTableFlag = false;
        this.venueLatMap = this.eventDetails.venueLat
        this.venueLonMap = this.eventDetails.venueLon
      })
  }
  facebook(eventUrl: string) {
    // facebook URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;
    window.open(facebookUrl, '_blank');
  }

  twitter(eventName: string, eventUrl: string) {
    //twitter URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=Check ${eventName}&url=${eventUrl}`;
    window.open(twitterUrl, '_blank');
  }
 

  sendDataToLocalStorage() {
    // console.log('heyy i clicked', this.redFlag)
    // var keyLS: any[] = [];

    // let favEvent: any = { id: this.eventDetails.eventId, value:[this.eventDetails.eventDate, this.eventDetails.eventName, this.eventDetails.genres, this.eventDetails.venueName]};
    let keyLS = JSON.parse(localStorage.getItem('keyLS') || '[]')
    if (keyLS.findIndex((a: any) => a.id === this.eventDetails.eventId) > -1) {
      // console.log('in before if', this.redFlag)
      keyLS.splice(keyLS.findIndex((a: any) => a.id === this.eventDetails.eventId), 1);
      alert("Removed from Favorites!")
      this.redFlag = false;
      // console.log('in before if', this.redFlag)
    }
    else {
      let favEvent: any = {
        id: this.eventDetails.eventId, value: [this.eventDetails.eventDate, this.eventDetails.eventName, this.eventDetails.genres, this.eventDetails.venueName, this.eventDetails.eventId]
      };
      // console.log(keyLS)
      keyLS.push(favEvent)
      alert('Event Added to Favorites')
      this.redFlag = true;
    }
    localStorage.setItem('keyLS', JSON.stringify(keyLS));
  }

  openDialog() {
    const dialogRef = this.dialog.open(MapsComponent, {
      data: { lat: this.eventDetails.venueLat, lon: this.eventDetails.venueLon }, disableClose: true,
      maxWidth:'97vw', position:{top:'6%'}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

}
