import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';

import { Contact, CONTACTS } from './contact';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];

  selectedContact?: Contact;

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.contactsService.getAllContacts().subscribe(({ contacts }) => {
      this.contacts = contacts;
    });
  }

  onSelectContact(contact: Contact): void {
    this.selectedContact = contact;
  }

  onUpdateContactClick(contact: Contact): void {
    this.contactsService.updateContact(contact).pipe(
      mergeMap(() => this.contactsService.getAllContacts())
    ).subscribe(({ contacts }) => {
      this.contacts = contacts;
    });
  }
}
