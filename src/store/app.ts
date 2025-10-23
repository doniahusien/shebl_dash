// Utilities
import { defineStore } from "pinia";
import axios from "axios";

export const useAppStore = defineStore("app", {
  state: () => ({
    notifications: [] as any[],
    notificationsLoading: false,
    unreadNotification: 0,
    unreadMessages: 0,
    sidebar: true,
    no_internet: false,
    countries: [],
    is_auth: localStorage.getItem("jwt_token_shebl_global") || null,
    notificationsData: {
      last_page: 1,
      current_page: 1
    },
    settings: null,
  }),
  getters: {
    getSettings: (state) => state.settings,
  },
  actions: {
    getNotifications(nextPage: string) {
      let page = this.notificationsData.current_page
      if (nextPage) {
        if (this.notificationsData.last_page > page) page++
        else return
      } else { 
        page = 1

      }
      this.notificationsLoading = true;
      axios.get("notifications", {
        params: {
          page: page
        }
      }).then((res) => {

        const result: any[] = res.data.data

        if (nextPage) {
          this.notifications.push(...res.data.data)
        } else {

          this.notifications = res.data.data;
        }
        this.unreadNotification = res.data.unread_count;

        this.notificationsData.last_page = res.data.meta.last_page
        this.notificationsData.current_page = res.data.meta.current_page
        this.notificationsLoading = false;
      }).catch(() => {
        this.notificationsLoading = false;
      })
    },
  },
});