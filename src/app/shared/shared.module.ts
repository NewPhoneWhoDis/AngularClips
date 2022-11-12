import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabscontainerComponent } from './tabscontainer/tabscontainer.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';



@NgModule({
  declarations: [
    ModalComponent,
    TabscontainerComponent,
    TabComponent,
    InputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalComponent,
    TabComponent,
    TabscontainerComponent,
    InputComponent
  ]
})
export class SharedModule { }
