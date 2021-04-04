import { Component, OnInit } from '@angular/core';

import { Contact, CONTACTS } from './contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  contacts = CONTACTS;

  selectedContact?: Contact;

  constructor() { }

  ngOnInit(): void {
  }

  onSelectContact(contact: Contact): void {
    this.selectedContact = contact;
  }

}
