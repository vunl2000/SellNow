export type TypeCustomer = 'quen' | 'vang_lai';

export interface CustomerModel {
  id: string;
  name: string;
  phone: string;
  type: TypeCustomer;
  address: string;
  map?: string;
  note?: string;
  createdAt: Date;
}
