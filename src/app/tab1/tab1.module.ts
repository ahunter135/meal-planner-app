import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';
import { AddComponent } from '../modals/add/add.component';
import { WeeklyComponent } from '../modals/weekly/weekly.component';
import { AddWeeklyComponent } from '../modals/add-weekly/add-weekly.component';
import { DateComponent } from '../modals/date/date.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page, LoginModalComponent, AddComponent,DateComponent, WeeklyComponent, AddWeeklyComponent]
})
export class Tab1PageModule {}
