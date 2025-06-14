import { toast } from "vue-sonner";

export const useUseShoppingListSupabase = () => 
{
  const supabase = useNuxtApp().$supabase;
  const logger = useLogger('useUseShoppingListSupabase');
  const userStore = useUserStore();

  async function synchronizeShoppingList() 
  {
    logger.info("synchronizeShoppingList start:");

    await userStore.refreshUser();
    const userId : string | null = userStore.getLoggedInUser.userId;
    logger.info("Synchronizing shopping list for user ID:", userId);

    if( !userId )
    {
      toast.error('Użytkownik nie jest zalogowany. Synchronizacja listy zakupów nie powiodła się.');
      return;
    }

    // sprawdź czy trzeba dodać wpisy do supabase
    const items = await useShoppingListRepo().getNotSyncedShoppingLists();
    logger.info("items.length:", items.length);
    
    for(const element of items)
    {
      const { data, error  } = await supabase.from('Shopping_list').select().eq('uuid', element.id);
      logger.info("Checking item in Supabase:", element.id, "Data:", data, "Error:", error);
      if( data?.length === 0 )
      {
        // If the item doesn't exist in Supabase, insert it
        await supabase.from('Shopping_list').insert([
          { uuid: element.id, owner: userId, name: element.name, status: element.status }
        ]);
      }
    }

    // sprawdź czy trzeba pobrać wpisy z supabase
    const { data, error  } = await supabase.from('Shopping_list').select().eq('owner', userId);
    logger.info("Fetched items from Supabase:", data, "Error:", error);
    if( error )
    {
      logger.error("Error fetching items from Supabase:", error);
      toast.error('Błąd podczas pobierania listy zakupów z Supabase. Spróbuj ponownie później.');
      return;
    }

    if( data && data.length > 0 )
    {
      const supabaseItems = data.map(item => ({
        id: item.uuid,
        name: item.name,
        status: item.status,
        createdAt: item.created_at,
        isSynced: true // oznaczamy, że lista jest zsynchronizowana z Supabase
      }));

      for(const item of supabaseItems)
      {
        logger.info("Checking local item:", item.id);

        if( !await useShoppingListRepo().checkIfShoppingListExists(item.id) )
        {
          // If the item doesn't exist in local storage, add it
          await useShoppingListRepo().addShoppingListFromSupabase(item.name, item.id, item.createdAt, item.status);
          logger.info("Added new item to local shopping list:", item.name);
        }
        else
        {
          await useShoppingListRepo().updateAsSynced( item );
          logger.info("Updated item in local shopping list:", item.name);
        }
      }

      logger.info("Local shopping list updated with items from Supabase.");
    }
    else
    {
      logger.info("No items found in Supabase for user ID:", userId);
    }
    logger.info("synchronizeShoppingList end:");
  }

  return { synchronizeShoppingList }
}
