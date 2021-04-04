export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export const CONTACTS: Contact[] = [
  { id: '1', name: 'Test Person', phoneNumber: '5555551234' },
  { id: '2', name: 'Sally McSallyface', phoneNumber: '5555551235' },
  { id: '3', name: 'Joey McJoeyface', phoneNumber: '5555551236' },
];
