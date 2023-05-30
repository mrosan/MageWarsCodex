import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { CatalogComponent } from './components/catalog/catalog.component';

const routes: Routes = [
  { path: 'codex', component: ListComponent },
  {
    path: 'catalog',
    component: CatalogComponent,
  },
  { path: '', redirectTo: '/codex', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
