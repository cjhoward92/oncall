import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit {

  @Output() created = new EventEmitter();

  newContact: Contact = {
    name: '',
    phoneNumber: '',
    id: '',
  };

  constructor(private contactService: ContactsService) { }

  ngOnInit(): void {
  }

  onCreateContactClick(contact: Contact): void {
    this.contactService.createContact(contact).subscribe(() => {
      this.created.emit();
    });
  }
}
