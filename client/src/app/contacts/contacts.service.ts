import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from './../../environments/environment';
import { Contact } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) { }

  public getAllContacts(): Observable<{ contacts: Contact[] }> {
    return this.http.get<{ contacts: Contact[] }>(`${environment.apiUrl}contacts`, {
      observe: 'body',
      responseType: 'json',
    });
  }

  public updateContact(contact: Contact): Observable<HttpResponse<any>> {
    return this.http.put(`${environment.apiUrl}contacts/${contact.id}`, contact, {
      observe: 'response',
    });
  }
}
