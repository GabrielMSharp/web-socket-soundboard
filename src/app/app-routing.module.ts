import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ServerComponent } from './server/server.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent
  }, {
    path: 'server',
    component: ServerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
