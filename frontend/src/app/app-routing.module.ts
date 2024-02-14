import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutingComponent } from './routing/routing.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: RoutingComponent },
  { path: '', redirectTo:'/search', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
