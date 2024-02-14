import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const delIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z"/></svg>`

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.css']
})

export class RoutingComponent {
  
  keyLS:any[] = [];
  fetchFavorites(){
    this.keyLS = JSON.parse(localStorage.getItem('keyLS') || '[]')
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
    iconRegistry.addSvgIconLiteral('trash-icon', sanitizer.bypassSecurityTrustHtml(delIcon));
  }
  ngOnInit() : void{
    // console.log('in favoritesssssssss')
    this.fetchFavorites()
    // console.log(this.keyLS)
  }
  removeElement(e:any){
    let keyLS = JSON.parse(localStorage.getItem('keyLS') || '[]');
    if (keyLS.findIndex((a: any) => a.id === e) >= 0) {
      keyLS.splice(keyLS.findIndex((a: any) => a.id === e), 1);
      alert("Removed from Favorites!")
    }
    localStorage.setItem('keyLS', JSON.stringify(keyLS));
    this.fetchFavorites()
    // console.log('in remove element')
  }
}
