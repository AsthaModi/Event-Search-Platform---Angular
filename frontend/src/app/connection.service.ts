import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient){ }
  autocomplete_keyword(keyword: string) :Observable<any[]>{
    // console.log('Auto complete in service', keyword)
    // const url = `http://localhost:3000/autocomplete?keyword=${keyword}`;
    const url = `/autocomplete?keyword=${keyword}`;
    return this.http.get<any[]>(url);
  }

  search_events(keyword: string, distance: string, category: string, lat: number, long: number) {
    // console.log('hghghidfjgkdi',lat,long)
    // const url = `http://localhost:3000/eventdetails?keyword=${keyword}&distance=${distance}&category=${category}&lat=${lat}&long=${long}`;
    const url = `/eventdetails?keyword=${keyword}&distance=${distance}&category=${category}&lat=${lat}&long=${long}`;
    // console.log(url)
    return this.http.get(url);
    
  }
  get_event_details(event_id: string){
    // console.log('Hereee in service', event_id)
    // const url = `http://localhost:3000/events?event_id=${event_id}`;
    const url = `/events?event_id=${event_id}`;
    // console.log(url)
      return this.http.get(url);
  }

  
}
