import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabscontainerComponent } from './tabscontainer/tabscontainer.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { AlertComponent } from './alert/alert.component';
import { EventBlockerDirective } from './directives/event-blocker.directive';



@NgModule({
  declarations: [
    ModalComponent,
    TabscontainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot() 
  ],
  exports: [
    ModalComponent,
    TabComponent,
    TabscontainerComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ]
})
export class SharedModule { }
