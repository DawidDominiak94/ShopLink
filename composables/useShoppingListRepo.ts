import { db, EShoppingListStatus, type ShoppingItem, type ShoppingList } from '~/utils/db'
import { v4 as uuidv4 } from 'uuid';


export const useShoppingListRepo = () => {

  const logger = useLogger('useShoppingListRepo');

  const fetchShoppingList = async () => {
    const all : ShoppingList[] = await db.shopping_list.toArray()
    logger.info('🧪 Wszystkie rekordy z Dexie:', all)
    return all
  }

  const deleteShoppingList = async (id: string) => {
    const shoppingList = await db.shopping_list.get(id);
    if (!shoppingList) {
      throw new Error(`Lista zakupów o ID ${id} nie została znaleziona.`);
    }
    await db.shopping_list.delete(id);
    logger.info(`🧪 Lista zakupów o ID ${id} została usunięta.`);
    return shoppingList;
  }

  const addShoppingListFromSupabase = async (name: string, id: string, createdAt: string, status: EShoppingListStatus) => {
    const shoppingList : ShoppingList = {
      id,
      name,
      createdAt: Date.parse(createdAt),
      updatedAt: Date.now(),
      items: [] as ShoppingItem[],
      status: status,
      isSynced: true, // oznaczamy, że lista jest zsynchronizowana z Supabase
    }
    await db.shopping_list.add(shoppingList, shoppingList.id);

    return await db.shopping_list.get(id);
  }

  const addShoppingList = async (name: string) => {
    const shoppingList : ShoppingList = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: [] as ShoppingItem[],
      status: EShoppingListStatus.ACTIVE, // domyślny status to 'active'
      isSynced: false, // oznaczamy, że lista nie jest zsynchronizowana z Supabase
    }
    const id = await db.shopping_list.add(shoppingList, shoppingList.id);

    return await db.shopping_list.get(id);
  }

  const fetchShoppingListById = async (id: string) : Promise<ShoppingList> => {
    const shoppingList = await db.shopping_list.get(id)
    if (!shoppingList) {
      throw new Error(`Lista zakupów o ID ${id} nie została znaleziona.`);
    }
    logger.info(`🧪 Lista zakupów o ID ${id}:`, shoppingList );
    return shoppingList;
  }

  const checkIfShoppingListExists = async (id: string): Promise<boolean> => {
    const shoppingList = await db.shopping_list.get(id);
    return shoppingList !== undefined;
  }

  // items

  const addShoppingItem = async (listId: string, item: ShoppingItem) => {
    const shoppingList = await fetchShoppingListById(listId);

    const newItem : ShoppingItem = {
      ...item,
      createdAt: Date.now(),
      synced: false,
      quantity: item.quantity || 1, // domyślna ilość to 1
      unit: item.unit || EShoppingItemUnit.PIECE, // domyślna jednostka to "szt."
    }

    shoppingList.items.push(newItem);
    shoppingList.updatedAt = Date.now();
    await db.shopping_list.put(shoppingList, listId);
    logger.info(`🧪 Dodano przedmiot do listy zakupów o ID ${listId}:`, newItem);
  }

  const updateShoppingItem = async (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    const shoppingList : ShoppingList = await fetchShoppingListById(listId);
    const itemIndex = shoppingList.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error(`Przedmiot o ID ${itemId} nie został znaleziony na liście zakupów o ID ${listId}.`);
    }

    const updatedItem = { ...shoppingList.items[itemIndex], ...updates, updatedAt: Date.now() };
    shoppingList.items[itemIndex] = updatedItem;
    shoppingList.updatedAt = Date.now();
    await db.shopping_list.put(shoppingList, listId);
    logger.info(`🧪 Zaktualizowano przedmiot o ID ${itemId} na liście zakupów o ID ${listId}:`, updatedItem)    ;
  }


  // syncinc

  const getNotSyncedShoppingLists = async () => {
    const allLists = await fetchShoppingList();
    return allLists.filter(list => !list.isSynced);
  }

  const getSyncedShoppingLists = async () => {
    const allLists = await fetchShoppingList();
    return allLists.filter(list => list.isSynced);
  }

  const updateAsSynced = async (list: ShoppingList) => {
    const shoppingList = await fetchShoppingListById(list.id);
    shoppingList.isSynced = true;
    shoppingList.name = list.name; // aktualizujemy nazwę listy
    shoppingList.updatedAt = Date.now(); // aktualizujemy czas aktualizacji
    shoppingList.status = list.status; // aktualizujemy status listy

    await db.shopping_list.put(shoppingList, list.id);
    logger.info(`🧪 Lista zakupów o ID ${list.id} została oznaczona jako zsynchronizowana.`) ;
    return shoppingList;
  }

  return { 
    checkIfShoppingListExists, 
    addShoppingList, 
    fetchShoppingList, 
    fetchShoppingListById, 
    addShoppingItem, 
    updateShoppingItem, 
    deleteShoppingList, 
    addShoppingListFromSupabase,
    updateAsSynced,
    getNotSyncedShoppingLists,
    getSyncedShoppingLists
  }
}
