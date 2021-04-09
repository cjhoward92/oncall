import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { Contact } from '../contact';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.scss']
})
export class UpdateContactComponent implements OnInit {

  @Input() selectedContact?: Contact;
  @Output() updated = new EventEmitter();

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
  }

  onUpdateContactClick(contact: Contact): void {
    this.contactsService.updateContact(contact).subscribe(() => {
      this.updated.emit();
    });
  }
}
