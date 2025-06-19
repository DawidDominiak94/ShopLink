import { toast } from "vue-sonner";

export const useSupabaseRepo = () => {

  const supabase = useNuxtApp().$supabase;
  const logger = useLogger('useSupabaseRepo');
  const userStore = useUserStore();
  const userId = userStore.userId;
  
  function checkIfUserIsLoggedIn() : void
  {
    if (!userId) 
    {
      logger.error("Użytkownik nie jest zalogowany.");
      toast.error('Musisz być zalogowany, aby korzystać z tej funkcji.');
      throw new Error('Użytkownik nie jest zalogowany.');
    }
  }

  async function getShoppingLists() : Promise<ShoppingList[]>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('shopping_list')
      .select();

    if (error) 
    {
      logger.error("Error fetching shopping lists from Supabase:", error);
      toast.error('Błąd podczas pobierania listy zakupów z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas pobierania listy zakupów z Supabase.');
    }

    return data || [];
  }

  async function addShoppingList(name: string): Promise<ShoppingList>
  {
    checkIfUserIsLoggedIn(); 

    const { data, error } = await supabase
      .from('shopping_list')
      .insert({
        name,
        owner_id_fk: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error)
    {
      logger.error("Error adding shopping list to Supabase:", error);
      toast.error('Błąd podczas dodawania listy zakupów do Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas dodawania listy zakupów do Supabase.');
    }

    return data;
  }

  async function deleteShoppingList(uuid: string): Promise<void>
  {
    checkIfUserIsLoggedIn();

    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', uuid)
      .eq('owner_id_fk', userId);

    if (error)
    {
      logger.error("Error deleting shopping list from Supabase:", error);
      toast.error('Błąd podczas usuwania listy zakupów z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas usuwania listy zakupów z Supabase.');
    }

    logger.info(`Lista zakupów o UUID ${uuid} została usunięta.`);
  }

  async function updateShoppingList(uuid: string, updates: Partial<ShoppingList>): Promise<ShoppingList>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('shopping_list')
      .update(updates)
      .eq('id', uuid)
      .eq('owner_id_fk', userId)
      .select()
      .single();

    if (error)
    {
      logger.error("Error updating shopping list in Supabase:", error);
      toast.error('Błąd podczas aktualizacji listy zakupów w Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas aktualizacji listy zakupów w Supabase.');
    }

    return data;
  }

  async function getShoppingListByUuid(uuid: string): Promise<ShoppingList | null>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('shopping_list')
      .select()
      .eq('id', uuid)
      .single();

    if (error)
    {
      logger.error("Error fetching shopping list by UUID from Supabase:", error);
      toast.error('Błąd podczas pobierania listy zakupów z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas pobierania listy zakupów z Supabase.');
    }

    return data;
  }

  async function getShoppingListItems(uuid: string): Promise<ShoppingItem[]>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('shopping_list_items')
      .select()
      .eq('shopping_list_id_fk', uuid)
      .order('created_at', { ascending: true });

    if (error)
    {
      logger.error("Error fetching shopping list elements from Supabase:", error);
      toast.error('Błąd podczas pobierania elementów listy zakupów z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas pobierania elementów listy zakupów z Supabase.');
    }

    return data || [];
  }

  async function addShoppingListItem(uuid: string, item: ShoppingItem): Promise<ShoppingItem>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('shopping_list_items')
      .insert({
        shopping_list_id_fk: uuid,
        text: item.text,
        created_at: new Date().toISOString(),
        bought: item.bought,
        quantity: item.quantity,
        unit: item.unit
      })
      .select()
      .single();

    if (error)
    {
      logger.error("Error adding shopping list item to Supabase:", error);
      toast.error('Błąd podczas dodawania elementu do listy zakupów w Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas dodawania elementu do listy zakupów w Supabase.');
    }

    return data;
  }

  async function updateShoppingListItem(uuid: string, itemId: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('shopping_list_items')
      .update(updates)
      .eq('id', itemId)
      .eq('shopping_list_id_fk', uuid)
      .select()
      .single();

    if (error)
    {
      logger.error("Error updating shopping list item in Supabase:", error);
      toast.error('Błąd podczas aktualizacji elementu listy zakupów w Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas aktualizacji elementu listy zakupów w Supabase.');
    }

    return data;
  }

  async function deleteShoppingListItem(uuid: string, itemId: string): Promise<boolean>
  {
    checkIfUserIsLoggedIn();

    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', itemId)
      .eq('shopping_list_id_fk', uuid);

    if (error)
    {
      logger.error("Error deleting shopping list item from Supabase:", error);
      toast.error('Błąd podczas usuwania elementu listy zakupów z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas usuwania elementu listy zakupów z Supabase.');
    }

    logger.info(`Element listy zakupów o ID ${itemId} został usunięty.`);

    return true;
  }

  async function getSyncedUsers()
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('synced_users')
      .select()
      .eq('owner_id', userId);

    if (error)
    {
      logger.error("Error fetching synced users from Supabase:", error);
      toast.error('Błąd podczas pobierania zsynchronizowanych użytkowników z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas pobierania zsynchronizowanych użytkowników z Supabase.');
    }

    const syncedUsers : SyncedUsers[] = data.map(user => ({
      id: user.id,
      description: user.description ?? 'Brak opisu',
      guest_id: user.guest_id ?? null
    }));

    logger.info(`Pobrano ${syncedUsers.length} zsynchronizowanych użytkowników.`);

    return syncedUsers || [];
  }

  async function createConnection( description: string ): Promise<SyncedUsers>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('synced_users')
      .insert({
        owner_id: userId,
        description
      })
      .select()
      .single();

    if (error)
    {
      logger.error("Error creating connection in Supabase:", error);
      toast.error('Błąd podczas tworzenia połączenia z użytkownikiem. Spróbuj ponownie później.');
      throw new Error('Błąd podczas tworzenia połączenia z użytkownikiem.');
    }

    return data;
  }

  async function getConnectionById( connectionId: string ): Promise<SyncedUsers | null>
  {
    checkIfUserIsLoggedIn();

    const { data, error } = await supabase
      .from('synced_users')
      .select()
      .eq('id', connectionId)
      .single();

    if (error)
    {
      logger.error("Error fetching connection by ID from Supabase:", error);
      toast.error('Błąd podczas pobierania połączenia z użytkownikiem. Spróbuj ponownie później.');
      throw new Error('Błąd podczas pobierania połączenia z użytkownikiem.');
    }

    return data;
  }

  async function linkConnection( connectionId: string, guestUserId: string ): Promise<SyncedUsers>
  {
    checkIfUserIsLoggedIn();
    
    const connection = await getConnectionById(connectionId);
    if( connection?.guest_id )
    {
      logger.error("Error linking connection in Supabase:");
      toast.error('Błąd podczas łączenia z użytkownikiem. Powiązanie zostało już wykorzystane.');
      throw new Error('Błąd podczas łączenia z użytkownikiem. Powiązanie zostało już wykorzystane.');
    }

    const { data, error } = await supabase
      .from('synced_users')
      .update({ guest_id: guestUserId })
      .eq('id', connectionId)
      .select()
      .single();

    if (error)
    {
      logger.error("Error linking connection in Supabase:", error);
      toast.error('Błąd podczas łączenia z użytkownikiem. Spróbuj ponownie później.');
      throw new Error('Błąd podczas łączenia z użytkownikiem.');
    }

    return data;
  }

  async function deleteConnection( connectionId: string ): Promise<boolean>
  {
    checkIfUserIsLoggedIn();

    const { error } = await supabase
      .from('synced_users')
      .delete()
      .eq('id', connectionId)
      .eq('owner_id', userId);

    if (error)
    {
      logger.error("Error deleting connection from Supabase:", error);
      toast.error('Błąd podczas usuwania połączenia z użytkownikiem. Spróbuj ponownie później.');
      throw new Error('Błąd podczas usuwania połączenia z użytkownikiem.');
    }

    logger.info(`Powiązanie o ID ${connectionId} zostało usunięte.`);

    return true;
  }

  return {
    getShoppingLists,
    addShoppingList,
    updateShoppingList,
    deleteShoppingList,
    getShoppingListByUuid,
    getShoppingListItems,
    addShoppingListItem,
    updateShoppingListItem,
    deleteShoppingListItem,
    getSyncedUsers,
    createConnection,
    linkConnection,
    deleteConnection
  }
}
