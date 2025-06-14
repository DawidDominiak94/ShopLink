import type { AuthResponse, UserResponse } from '@supabase/supabase-js';
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner';

export interface UserStoreState {
  userId: string | null;
  userEmail: string | null;
  lastLoggedIn: Date | null;
  createdAt: Date | null;
}

export const useUserStore = defineStore('UserStore',{
  state: () => { 
    return {
      userId: null,
      userEmail: null,
      lastLoggedIn: null,
      createdAt: null
  } as UserStoreState },
  getters:{ 
    getLoggedInUser: (state): UserStoreState => {
      return {
        userId: state.userId,
        userEmail: state.userEmail,
        lastLoggedIn: state.lastLoggedIn,
        createdAt: state.createdAt
      };
    }
  },
  actions: {
    async logIn(email:string, password:string )
    {
      const { data, error } : AuthResponse = await useUseAuth().login(email, password);

      if( error )
        toast.error(error.message);

      if( data.user )
      {
        this.userId = data.user.id;
        this.userEmail = data.user.email ?? null;
        this.lastLoggedIn = data.user.last_sign_in_at !== undefined ? new Date(data.user.last_sign_in_at) : null;
        this.createdAt = data.user.created_at !== undefined ? new Date(data.user.created_at) : null;

        toast.success('Zalogowano pomyślnie.');
        setTimeout(() => { navigateTo({ name:'index' }) },2000);
      }
    },
    logOut()
    {
      this.userId = null;
      this.userEmail = null;
      this.lastLoggedIn = null;
      this.createdAt = null;
    },
    register(email:string, password:string )
    {

    },
    async refreshUser()
    {

      if( this.userId )
        return;

      const data : UserResponse = await useUseAuth().getCurrentUser();
      if( data.data.user )
      {
        this.userId = data.data.user .id;
        this.userEmail = data.data.user .email ?? null;
        this.lastLoggedIn = data.data.user .last_sign_in_at !== undefined ? new Date(data.data.user .last_sign_in_at) : null;
        this.createdAt = data.data.user .created_at !== undefined ? new Date(data.data.user .created_at) : null;
      }
    }

  }
})
