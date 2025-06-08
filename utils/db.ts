import Dexie, { type Table } from 'dexie'

export interface ShoppingList{
    id: string          // np. UUID
    name: string        // "Zakupy na weekend"
    createdAt: number   // timestamp
    updatedAt: number   // timestamp
    items: ShoppingItem[] // lista przedmiotów
    status: EShoppingListStatus
}
// Typ pojedynczego wpisu
export interface ShoppingItem {
  id: string                  // np. UUID
  text: string                // "mleko", "makaron"
  createdAt: number           // timestamp
  bought: boolean             // czy kupione
  synced: boolean             // czy zsynchronizowane z Supabase
  quantity: number            // ilość, np. 2
  unit: EShoppingItemUnit      // jednostka miary, np. "szt.", "kg"
}

export enum EShoppingListStatus {
  ACTIVE = 'active',         // aktywna lista zakupów
  COMPLETED = 'completed',   // lista zakupów zakończona
  ARCHIVED = 'archived'      // lista zakupów zarchiwizowana
}

export enum EShoppingItemUnit {
  PIECE = 'szt.',
  KILOGRAM = 'kg',
  LITER = 'l',
  GRAM = 'g',
  MILLILITER = 'ml',
  PACKET = 'opak.',
  BOX = 'pudeł.',
  BOTTLE = 'butel.',
  CAN = 'puszka',
  BAG = 'torba',
  OTHER = 'inne' // domyślna jednostka
}

// Klasa bazy danych
class ShopLinkDexie extends Dexie {
  shopping_list!: Table<ShoppingList, string>
  shopping_items!: Table<ShoppingItem, string>

  constructor() {
    super('shoplink_db')
    this.version(1).stores({
      shopping_list: '&id, name, createdAt, updatedAt, items, status',
      shopping_items: '&id, text, createdAt, bought, synced, quantity, unit'
    })
  }
}

// Instancja bazy
export const db = new ShopLinkDexie()