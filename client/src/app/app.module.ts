import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NavComponent } from './nav/nav.component';
import { PhonePipe } from './phone.pipe';
import { PhoneMaskDirective } from './phone-mask.directive';
import { UpdateContactComponent } from './contacts/update-contact/update-contact.component';
import { CreateContactComponent } from './contacts/create-contact/create-contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    NavComponent,
    PhonePipe,
    PhoneMaskDirective,
    UpdateContactComponent,
    CreateContactComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
