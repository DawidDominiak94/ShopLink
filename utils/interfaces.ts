export interface ShoppingList
{
    id: string          // np. UUID
    name: string        // "Zakupy na weekend"
    createdAt: number   // timestamp
    updatedAt: number   // timestamp
    status: EShoppingListStatus
}
// Typ pojedynczego wpisu
export interface ShoppingItem 
{
  id: string                  // np. UUID
  text: string                // "mleko", "makaron"
  createdAt: number           // timestamp
  bought: boolean             // czy kupione
  quantity: number            // ilość, np. 2
  unit: EShoppingItemUnit      // jednostka miary, np. "szt.", "kg"
}

export enum EShoppingListStatus 
{
  ACTIVE = 'active',         // aktywna lista zakupów
  COMPLETED = 'completed',   // lista zakupów zakończona
  ARCHIVED = 'archived'      // lista zakupów zarchiwizowana
}

export enum EShoppingItemUnit 
{
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

export interface SyncedUsers
{
  id: string;
  description: string; // np. "Jan Kowalski"
}