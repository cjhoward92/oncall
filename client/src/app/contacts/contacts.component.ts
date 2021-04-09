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
  createNew = false;

  selectedContact?: Contact;

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.onContactsChanged();
  }

  onSelectContact(contact: Contact): void {
    this.selectedContact = contact;
  }

  onContactsChanged(): void {
    this.createNew = false;
    console.log('Contacts changed - reloading');
    this.contactsService.getAllContacts().subscribe(({ contacts }) => {
      this.contacts = contacts;
    });
  }

  onCreateNew(): void {
    this.createNew = true;
  }

  onDeleteContact(contact: Contact): void {
    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
      this.contactsService.deleteContact(contact.id).subscribe(() => {
        this.onContactsChanged();
      });
    }
  }
}
