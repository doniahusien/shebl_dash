<template>
  <div>
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="text-md font-medium text-black w-full text-left flex justify-between items-center focus:outline-none py-4 animated wow zoomIn"
        data-wow-duration="1.3s"
        data-wow-delay="0s"
      >
        <div class="flex gap-2 items-center">
          <div>
            <img src="@/assets/images/feedback.png" alt="feedback" />
          </div>
          <div class="flex flex-col gap-2">
            <p>{{ item.date }}</p>
            <div class="flex gap-1 items-center">
              <svg-icon name="store1" />
              <p class="text-sub">{{ $t("TITLES.store") }}:</p>
              <p>{{ item.store }}</p>
            </div>
          </div>
        </div>
        <i
          class="fa-solid text-lg ms-auto text-sub w-5 h-5 p-4 rounded-full flex items-center justify-center"
          :class="open ? 'fa-angle-up ' : 'fa-angle-down'"
        ></i>
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="py-4 space-y-6 md:ms-16 border-t border-line">
          <div
            v-for="feedback in item.feedbacks"
            :key="feedback.id"
            class="flex gap-2"
          >
            <img
              src="@/assets/images/brand/question.png"
              alt="question-image"
              class="w-[24px] h-[24px]"
            />
            <div class="flex flex-col gap-1">
              <p class="font-bold text-lg">{{ feedback.question }}</p>
              <p>{{ feedback.answer }}</p>
            </div>
          </div>
          <div v-if="item.note">
            <p class="text-sub">{{ $t("LABELS.Client’s Note") }}</p>
            <div class="md:w-[90%] rounded-lg p-4 pb-8 border border-line">
              <p>{{ item.note }}</p>
            </div>
          </div>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
defineProps({
  item: {
    required: true,
  },
});
</script>
