import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsModuleRoutingModule } from './calls-module-routing.module';
import { CallsComponent } from './calls/pages/calls/calls.component';
import { CallDetailsComponent } from './call-details/pages/call-details/call-details.component';
import { AgGridModule } from 'ag-grid-angular';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CallsComponent, CallDetailsComponent],
  imports: [
    CommonModule,
    CallsModuleRoutingModule,
    AgGridModule,
    InputIconModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
  ],
  exports: [CallsComponent, CallDetailsComponent],
})
export class CallsModuleModule {}
