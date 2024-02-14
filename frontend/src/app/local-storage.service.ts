import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  [x: string]: any;

  constructor() { }
  setData(key: string, data: any): void {
    const dataString = JSON.stringify(data);
    localStorage.setItem(key, dataString);
    console.log('in local storage')
  }
  // getData()
}
