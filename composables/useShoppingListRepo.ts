import { db, EShoppingListStatus, type ShoppingItem, type ShoppingList } from '~/utils/db'
import { v4 as uuidv4 } from 'uuid';

export const useShoppingListRepo = () => {

  const fetchShoppingList = async () => {
    const all = await db.shopping_list.toArray()
    console.log('🧪 Wszystkie rekordy z Dexie:', all)
    return all
  }

  const deleteShoppingList = async (id: string) => {
    const shoppingList = await db.shopping_list.get(id);
    if (!shoppingList) {
      throw new Error(`Lista zakupów o ID ${id} nie została znaleziona.`);
    }
    await db.shopping_list.delete(id);
    console.log(`🧪 Lista zakupów o ID ${id} została usunięta.`);
    return shoppingList;
  }

  const addShoppingList = async (name: string) => {
    const shoppingList = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: [] as ShoppingItem[],
      status: EShoppingListStatus.ACTIVE, // domyślny status to 'active'
    }
    const id = await db.shopping_list.add(shoppingList, shoppingList.id);

    return await db.shopping_list.get(id);
  }

  const fetchShoppingListById = async (id: string) : Promise<ShoppingList> => {
    const shoppingList = await db.shopping_list.get(id)
    if (!shoppingList) {
      throw new Error(`Lista zakupów o ID ${id} nie została znaleziona.`);
    }
    console.log(`🧪 Lista zakupów o ID ${id}:`, shoppingList );
    return shoppingList;
  }

  const addShoppingItem = async (listId: string, item: ShoppingItem) => {
    const shoppingList = await fetchShoppingListById(listId);

    const newItem = {
      ...item,
      createdAt: Date.now(),
      synced: false,
      quantity: item.quantity || 1, // domyślna ilość to 1
      unit: item.unit || EShoppingItemUnit.PIECE, // domyślna jednostka to "szt."
    }

    shoppingList.items.push(newItem);
    shoppingList.updatedAt = Date.now();
    await db.shopping_list.put(shoppingList, listId);
    console.log(`🧪 Dodano przedmiot do listy zakupów o ID ${listId}:`, newItem);
  }

  const updateShoppingItem = async (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    const shoppingList = await fetchShoppingListById(listId);
    const itemIndex = shoppingList.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error(`Przedmiot o ID ${itemId} nie został znaleziony na liście zakupów o ID ${listId}.`);
    }

    const updatedItem = { ...shoppingList.items[itemIndex], ...updates, updatedAt: Date.now() };
    shoppingList.items[itemIndex] = updatedItem;
    shoppingList.updatedAt = Date.now();
    await db.shopping_list.put(shoppingList, listId);
    console.log(`🧪 Zaktualizowano przedmiot o ID ${itemId} na liście zakupów o ID ${listId}:`, updatedItem)    ;
  }

  return { addShoppingList, fetchShoppingList, fetchShoppingListById, addShoppingItem, updateShoppingItem, deleteShoppingList }
}
