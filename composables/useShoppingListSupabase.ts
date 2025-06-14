import { toast } from "vue-sonner";

export const useUseShoppingListSupabase = () => 
{
  const supabase = useNuxtApp().$supabase;
  const logger = useLogger('useUseShoppingListSupabase');
  const userStore = useUserStore();

  async function synchronizeShoppingList() 
  {
    logger.info("synchronizeShoppingList start:");

    const userId : string = await getSupabaseUserId();

    // sprawdź czy trzeba dodać wpisy do supabase
    const items = await useShoppingListRepo().getNotSyncedShoppingLists();    
    const supabaseItems = await getShoppingLists(userId);


    await synchronizeFromLocalToSupabase( items, supabaseItems, userId );

    // sprawdź czy trzeba pobrać wpisy z supabase

    await synchronizeFromSupabaseToLocal(supabaseItems);


    logger.info("synchronizeShoppingList end:");
  }

  async function deleteShoppingListPositions( id: number )
  {
    const { data, error } = await supabase.from('Shopping_list_items').delete().eq('shopping_list_id_fk', id);
    logger.info("Deleted items from Supabase:", data, "Error:", error);
    if( error )
    {
      logger.error("Error deleting items from Supabase:", error);
      toast.error('Błąd podczas usuwania pozycji z listy zakupów w Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas usuwania pozycji z listy zakupów w Supabase.');
    }
  }

  async function deleteShoppingListFromSupabase( uuid: string )
  {
    const { data, error } = await supabase.from('Shopping_list').delete().eq('uuid', uuid);
    logger.info("Deleted item from Supabase:", data, "Error:", error);
    if( error )
    {
      logger.error("Error deleting item from Supabase:", error);
      toast.error('Błąd podczas usuwania listy zakupów z Supabase. Spróbuj ponownie później.');
      throw new Error('Błąd podczas usuwania listy zakupów z Supabase.');
    }
  }

  async function getShoppingLists( userId: string ): Promise<ShoppingList[]>
  {
    const { data, error  } = await supabase.from('Shopping_list').select().eq('owner', userId);
    logger.info("Fetched items from Supabase:", data, "Error:", error);
    if( error || data === null )
    {
      logger.error("Error fetching items from Supabase:", error);
      toast.error('Błąd podczas pobierania listy zakupów z Supabase. Spróbuj ponownie później.');
      return [];
    }



    return await Promise.all(
      data.map(async item => ({
        id: item.id,
        uuid: item.uuid,
        name: item.name,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at ?? item.created_at, // fallback if updated_at is missing
        items: await getShoppingListItems(item.id), // fallback to empty array if items are missing
        isSynced: true // oznaczamy, że lista jest zsynchronizowana z Supabase
      }))
    );
  }

  async function getShoppingListItems( shoppingListId: number ): Promise<ShoppingItem[]>
  {
    const { data, error } = await supabase.from('Shopping_list_items').select().eq('shopping_list_id_fk', shoppingListId);
    logger.info("Fetched items from Supabase:", data, "Error:", error);
    if( error || data === null )
    {
       return [];
    }

    return data;
  }

  async function getSupabaseUserId(): Promise<string>
  {
    await userStore.refreshUser();
    const userId : string | null = userStore.getLoggedInUser.userId;
    logger.info("Synchronizing shopping list for user ID:", userId);

    if( !userId )
    {
      toast.error('Użytkownik nie jest zalogowany. Synchronizacja listy zakupów nie powiodła się.');
      throw new Error('Użytkownik nie jest zalogowany.');
    }

    return userId;
  }

  async function listExistsInSupabase( uuid: string, supabaseItems: ShoppingList[] ): Promise<boolean>
  {
    return supabaseItems.some(item => item.uuid === uuid);
  }

  async function addListToSupabase( list: ShoppingList, userId: string ) : Promise<ShoppingList>
  {
    // If the item doesn't exist in Supabase, insert it
    const { data, error } = await supabase.from('Shopping_list').insert([
      { uuid: list.uuid, owner: userId, name: list.name, status: list.status }
    ])
    .select();

    if( error )
    {
      toast.error('Błąd podczas dodawania listy zakupów do Supabase. Spróbuj ponownie później.', { description: error.message });
      throw new Error('Błąd podczas dodawania listy zakupów do Supabase.');
    }

    return data[0];
  }

  async function synchronizeFromLocalToSupabase(  items: ShoppingList[], supabaseItems: ShoppingList[], userId: string)
  {
    logger.info("[synchronizeFromLocalToSupabase] Synchronizing items from local to Supabase:", items);
    for(const element of items)
    {
      logger.info("[synchronizeFromLocalToSupabase] loop element:", element);
      logger.info("[synchronizeFromLocalToSupabase] listExistsInSupabase:", await listExistsInSupabase(element.uuid, supabaseItems));
      if(  !(await listExistsInSupabase(element.uuid, supabaseItems)) )
      {
        // If the item doesn't exist in Supabase, insert it
        const data = await addListToSupabase(element, userId);

        logger.info("Synchronizing items for list:", element.items);
        if( data )
          for( const localShoppingItem of element.items )
            await addShoppingListPositionToSupabase( data.id, localShoppingItem );
      }
    }
  }

  async function addShoppingListPositionToSupabase( shoppingListId: number, item: ShoppingItem )
  {
    await supabase.from('Shopping_list_items').insert([
      { 
        shopping_list_id_fk: shoppingListId, 
        uuid: item.uuid,
        text: item.text,
        quantity: item.quantity,
        unit: item.unit,
        synced: true,
        bought: item.bought
      }
  ]);
  }

  async function synchronizeFromSupabaseToLocal(supabaseItems: ShoppingList[])
  {
    if( supabaseItems && supabaseItems.length > 0 )
    {
      for(const item of supabaseItems)
      {
        await synchronizeFromSupabaseToLocalSingleItem(item);
      }

      logger.info("Local shopping list updated with items from Supabase.");
    }
  }

  async function synchronizeFromSupabaseToLocalSingleItem( item: ShoppingList )
  {
    logger.info("Checking local item:", item.uuid);

    if( !await useShoppingListRepo().checkIfShoppingListExists(item.uuid) )
    {
      // If the item doesn't exist in local storage, add it
      await useShoppingListRepo().addShoppingListFromSupabase(item.name, item.id, item.uuid, item.createdAt, item.status);
      logger.info("Added new item to local shopping list:", item.name);
    }
    else
    {
      await synchronizeFromSupabasePositionsToLocal( item );
      await useShoppingListRepo().updateAsSynced( item );
      
      logger.info("Updated item in local shopping list:", item.name);
    }
  }

  async function synchronizeFromSupabasePositionsToLocal( shoppingList : ShoppingList )
  {
    logger.info("Synchronizing shopping list positions from Supabase to local for list ID:", shoppingList.id);
    const supabaseItems = await getShoppingListItems(shoppingList.id);
    const localItems = (await useShoppingListRepo().fetchShoppingListById(shoppingList.uuid)).items;

    // Iterate through Supabase items and check if they exist in local storage
    for(const supabaseItem of supabaseItems)
    {
      const exists = localItems.some(item => item.uuid === supabaseItem.uuid);
      if( !exists )
      {
        // If the item doesn't exist in local storage, add it
        await useShoppingListRepo().addShoppingItem(shoppingList.uuid, supabaseItem);
        logger.info("Added new item to local shopping list:", supabaseItem.text);
      }
      else
      {
        // If the item exists, update it
        await useShoppingListRepo().updateShoppingItem(shoppingList.uuid, supabaseItem.uuid, supabaseItem);
        logger.info("Updated item in local shopping list:", supabaseItem.text);
      }
    }
  }

  async function markItemAsDone( item: ShoppingItem )
  {
    await supabase.from('Shopping_list_items').update({ bought: item.bought }).eq('uuid', item.uuid);
  }

  return { markItemAsDone, addShoppingListPositionToSupabase, synchronizeShoppingList, deleteShoppingListFromSupabase, addListToSupabase, deleteShoppingListPositions }
}
