export interface InventoryHistoryModel {
  id: string;
  productId: string;
  qty: number;
  type: "import" | "export"; 
  note?: string;
  createdAt: Date;
}