<template>
  <base-card1
    :class="item.is_readed ? '' : ' !bg-primary/15'"
    class="bg-white border flex items-center gap-1 border-border"
  >
    <button type="button" class="flex-1" @click="moveToNotification()">
      <h5 class="font-semibold text-lg text-start">{{ item.title }}</h5>
      <p class="text-sub text-start">
        {{ item.body }}
      </p>
    </button>

    <div
      @click.stop
      v-if="item.id"
      class="flex md:flex-col justify-between md:items-end items-center gap-1"
    >
      <Deleter
        :url="`notifications/${item.id}`"
        :id="item.id"
        icon-class="*:fill-error"
        method="delete"
        button-name="BUTTONS.Yes Delete"
        @remove="emit('delete', item.id)"
        v-if="
          checkPermission('notifications', 'destroy') || user_type === 'doctor'
        "
      />
      <p class="text-text text-end text-sm">{{ item.created_time }}</p>
    </div>
  </base-card1>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, toRef } from "vue";
import axios from "axios";
import { useAppStore } from "@/store/app";
import { useAppAuth } from "@/store/auth";
import { checkPermission } from "@/utils/permissions";
const router = useRouter();
const isLoading = ref(false);

const props = defineProps({
  item: {
    required: true,
    type: Object,
  },
  path: {
    required: false,
  },
});
const item = toRef(props.item);
const emit = defineEmits(["delete", "close"]);
const appStore = useAppStore();
const appAuth = useAppAuth();
const user_type =
  appAuth.user_type || localStorage.getItem("lavander_global_user_type");
function moveToNotification() {
  if (!checkPermission("notifications", "index") && user_type != "doctor")
    return;
  if (!item.value.is_readed) {
    axios.get(`/notifications/read/${item.value.id}`).then((res) => {
      item.value = res.data.data;
      if (appStore.unreadNotification == "+99") {
        appStore.unreadNotification = "+99";
      } else {
        appStore.unreadNotification -= 1;
      }
      item.value.is_readed = true;
    });
  }

  if (item.value.data.notify_type === "appointment") {
    router.push(`/reservations/show/${item.value.data.notify_id}`);
    emit("close");
  } else if (item.value.data.notify_type === "order") {
    router.push(`/orders/show/${item.value.data.notify_id}`);
    emit("close");
  } else if (item.value.data.notify_type === "offer") {
    router.push(`/offers/show/${item.value.data.notify_id}`);
    emit("close");
  } else if (item.value.key === "contact" || item.value.key === "ticket") {
    router.push(`/support-tickets/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "user") {
    router.push(`/retailers/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "product") {
    router.push(`/products/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "provider") {
    router.push(`/wholesalers/show/${item.value.key_id}`);
    emit("close");
  }

  // if (link) {
  //   router.push(link);
  //   emit("close");
  // }
}
</script>

<style></style>
