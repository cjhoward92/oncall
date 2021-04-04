import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NavComponent } from './nav/nav.component';
import { PhonePipe } from './phone.pipe';
import { PhoneMaskDirective } from './phone-mask.directive';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    NavComponent,
    PhonePipe,
    PhoneMaskDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
