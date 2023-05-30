import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { MagesComponent } from './components/mages/mages.component';

const routes: Routes = [
  { path: 'codex', component: ListComponent },
  {
    path: 'catalog',
    component: CatalogComponent,
  },
  {
    path: 'mages',
    component: MagesComponent,
  },
  { path: '', redirectTo: '/codex', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
