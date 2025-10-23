<template>
  <div class="flex gap-3 items-center w-full">
    <Image
      width="60"
      height="60"
      class="rounded-lg h-[60px] w-[60px] object-cover flex-shrink-0 border-line"
      image-class="rounded-lg h-[60px] w-[60px] object-cover border-line"
      :src="image"
      :alt="title || 'image'"
      v-if="image"
      image=""
      preview
      :class="imgClass"
    >
      <template #image>
        <img
          width="60"
          height="60"
          class="rounded-lg h-[60px] w-[60px] object-contain border-line"
          :src="image"
          :alt="title || 'image'"
          @error="imgError"
          :class="imgClass"
        />
      </template>

      <template #preview="slotProps">
        <img
          @error="imgError"
          :src="image"
          alt="preview"
          class="object-contain"
          :style="slotProps.style"
          @click="slotProps.onClick"
        />
      </template>
    </Image>

    <div class="h-full flex flex-col">
      <template v-if="title || title == 0">
        <router-link v-if="titleClickable" :to="titleClickable">
          <h4
            v-tooltip.bottom="
              title.length ? title.replace(/<[^>]*>/g, '') : title
            "
            class="mb-1 font-semibold text-start whitespace-nowrap min-w-[100px] capitalize text-text"
            :class="[
              $i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer',
              titleClass,
            ]"
          >
            {{ title.length ? title.replace(/<[^>]*>/g, "") : title }}

            <span class="text-placeholder" v-if="sec_title"
              >({{ sec_title }})</span
            >
          </h4>
        </router-link>
        <h4
          v-else
          v-tooltip.bottom="{
            content: title.length ? title.replace(/<[^>]*>/g, '') : title,
            error: !title.length,
          }"
          class="mb-1 font-semibold text-start whitespace-nowrap min-w-[100px] capitalize text-text"
          :class="[
            $i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer',
            titleClass,
          ]"
        >
          {{ title.length ? title.replace(/<[^>]*>/g, "") : title }}

          <span class="text-placeholder" v-if="sec_title"
            >({{ sec_title }})</span
          >
        </h4>
      </template>

      <h4
        class="mb-1 font-semibold text-start min-w-[100px] capitalize text-error"
        :class="$i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer'"
        v-else-if="title === null"
      >
        {{ $t("Not Exist") }}
      </h4>

      <p
        :title="text.replace(/<[^>]*>/g, '')"
        class="text-[12px] text-start text-sub"
        v-if="text"
        :class="[
          $i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer',
          textClass,
        ]"
      >
        {{ text.replace(/<[^>]*>/g, "") }}
      </p>

      <p
        :title="text.replace(/<[^>]*>/g, '')"
        class="text-[12px] text-start text-sub line-clamp-2"
        v-if="subText"
        :class="[
          $i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer',
          textClass,
        ]"
      >
        {{ subText.replace(/<[^>]*>/g, "") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import Tooltip from "primevue/tooltip";
import Image from "primevue/image";

defineProps([
  "image",
  "title",
  "text",
  "subText",
  "textClass",
  "sec_title",
  "showBorder",
  "titleClass",
  "titleClickable",
  "imgClass",
]);
</script>
