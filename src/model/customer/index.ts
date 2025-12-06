export interface CustomerModel {
  id: string;
  name: string;
  phone: string;
  address: string;
  note?: string;
  createdAt: Date;
}