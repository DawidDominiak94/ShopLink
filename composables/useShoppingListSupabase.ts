
export const useUseShoppingListSupabase = () => 
{

  async function synchronizeShoppingList() 
  {
    console.log("synchronizeShoppingList start:");

    const userId : string | undefined = await (await useUseAuth().getCurrentUser())?.data?.user?.id;
    console.log("Synchronizing shopping list for user ID:", userId);

    if( !userId )
    {
      console.error("User is not authenticated. Cannot synchronize shopping list.");
      return;
    }

    // sprawdź czy trzeba dodać wpisy do supabase
    const items = await useShoppingListRepo().fetchShoppingList();
    console.log("items.length:", items.length);
    
    for(const element of items)
    {
      const { data, error  } = await supabase.from('Shopping_list').select().eq('uuid', element.id);
      console.log("Checking item in Supabase:", element.id, "Data:", data, "Error:", error);
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
    console.log("Fetched items from Supabase:", data, "Error:", error);
    if( error )
    {
      console.error("Error fetching items from Supabase:", error);
      return;
    }

    if( data && data.length > 0 )
    {
      const supabaseItems = data.map(item => ({
        id: item.uuid,
        name: item.name,
        status: item.status,
        createdAt: item.created_at
      }));

      for(const item of supabaseItems)
      {
        console.log("Checking local item:", item.id);

        if( await useShoppingListRepo().checkIfShoppingListExists(item.id) )
        {
          // If the item doesn't exist in local storage, add it
          await useShoppingListRepo().addShoppingListFromSupabase(item.name, item.id, item.createdAt, item.status);
          console.log("Added new item to local shopping list:", item.name);
        }
      }


      console.log("Local shopping list updated with items from Supabase.");
    }
    else
    {
      console.log("No items found in Supabase for user ID:", userId);
    }
    console.log("synchronizeShoppingList end:");
  }

  return { synchronizeShoppingList }
}
