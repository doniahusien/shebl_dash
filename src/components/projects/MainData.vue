<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

interface Props {
  item: {
    name: string;
    image: string;
    desc: string;
    about_title: string;
    about_desc: string;
    about_media: string;
    about_media_type: string;
  };
}

defineProps<Props>();

const { t } = useI18n();
const route = useRoute();
</script>

<template>
  <div>
    <div class="grid gap-5 py-5 grid-cols-1 lg:grid-cols-2 items-center">
      <div class="rounded-2xl">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="relative !w-full rounded-2xl object-cover max-h-[400px]"
        />
        <img
          v-else
          src="@/assets/dynamic/section.png"
          :alt="item.name"
          class="relative !w-full rounded-2xl object-cover max-h-[400px]"
        />
      </div>
      <div>
        <h2
          class="text-3xl lg:text-4xl lg:leading-[2.8rem] text-text font-bold leading-[2.5rem] capitalize"
        >
          {{ item.name }}
        </h2>
        <div class="text-text-light max-w-[500px]" v-html="item.desc"></div>
      </div>
    </div>
    <div class="grid gap-5 py-5 grid-cols-1 lg:grid-cols-2 items-center">
      <div class="rounded-2xl lg:order-2">
        <template v-if="item.about_media">
          <img
            v-if="item.about_media_type == 'image'"
            :src="item.about_media"
            :alt="item.about_title"
            class="relative !w-full rounded-2xl object-cover max-h-[400px]"
          />
          <video
            v-else
            width="100%"
            height="80vh"
            class="object-cover rounded-lg"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source :src="item.about_media" type="video/mp4" />
            <source :src="item.about_media" type="video/webm" />
          </video>
        </template>
        <template v-else>
          <img
            src="@/assets/dynamic/section.png"
            :alt="item.name"
            class="relative rounded-2xl object-conatin max-h-[400px] ms-auto"
          />
        </template>
      </div>
      <div class="lg:order-1">
        <h2
          class="text-3xl lg:text-4xl lg:leading-[2.8rem] text-text font-bold leading-[2.5rem] capitalize"
        >
          {{ item.about_title }}
        </h2>
        <div
          class="text-text-light max-w-[500px]"
          v-html="item.about_desc"
        ></div>
      </div>
    </div>

    <router-link
      :to="{
        name: 'add-project-main-data',
        params: {
          id: route.params.id ?? '',
        },
      }"
      class="base-btn mx-auto py-1 w-fit"
    >
      {{ t(`BUTTONS.${route.params.id ? "edit" : "create"}`) }}
    </router-link>
  </div>
</template>

<style lang="scss" scoped></style>
