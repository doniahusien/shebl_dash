<template>
  <div class="flex items-start gap-2 py-4 px-5">
    <img
      width="95"
      height="50"
      src="@/assets/images/stats/a.png"
      alt="package name"
    />
    <div class="flex-1">
      <div class="flex gap-2 justify-between mb-3">
        <h3 class="text-lg font-bold text-text">{{ item.name }}</h3>
        <div class="flex items-center gap-2">
          {{ $t("LABELS.Available") + " :" }}
          <switcher
            v-model:modalValue="item.is_active"
            url="test"
            class="mt-1"
          />
          <div class="flex items-center gap-5" v-if="trashed">
            <Restore
              :url="`package/restore/${item.id}`"
              @remove="remove(item.id)"
            />
            <Deleter
              :url="`package/force-delete/${item.id}`"
              @remove="remove(item.id)"
            />
          </div>
          <action-menu
            v-else
            class="ms-2"
            :edit="true"
            :remove="true"
            :item="item"
            name="package"
            @edit="$router.push(`/packages/form/${item.id}`)"
            @remove="remove(item.id)"
          />
        </div>
      </div>
      <ul class="package_details">
        <!-- <li>
          <p class="name">
            <img
              src="@/assets/images/icons/period.png"
              width="16"
              height="16"
              alt="icon"
            />
            {{ $t("LABELS.periodOfPackage") + " :" }}
          </p>
          <p class="value">3 Month</p>
        </li> -->
        <li>
          <p class="name">
            <img
              src="@/assets/images/icons/price.png"
              width="16"
              height="16"
              alt="icon"
            />
            {{ $t("LABELS.monthlyPrice") + " :" }}
          </p>
          <p class="value">{{ item.monthly_price }} $</p>
        </li>
        <li>
          <p class="name">
            <img
              src="@/assets/images/icons/price.png"
              width="16"
              height="16"
              alt="icon"
            />
            {{ $t("LABELS.yearlyPrice") + " :" }}
          </p>
          <p class="value">{{ item.yearly_price }} $</p>
        </li>
        <!-- <li>
          <p class="name">
            <img
              src="@/assets/images/icons/price.png"
              width="16"
              height="16"
              alt="icon"
            />
            {{ $t("LABELS.priceOfPackage") + " :" }}
          </p>
          <p class="value">100 $</p>
        </li> -->
        <li>
          <p class="name">
            <img
              src="@/assets/images/icons/user.png"
              width="16"
              height="16"
              alt="icon"
            />
            {{ $t("LABELS.noOfSubscriptions") + " :" }}
          </p>
          <p class="value">50 subscriptions (This is static value)</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  item: { required: true, type: Object },
  trashed: { required: false, type: Boolean },
});
const switchValue = ref(true);

const emit = defineEmits(["remove"]);
function remove(id) {
  emit("remove", id);
}
</script>

<style lang="scss">
.package_details {
  li {
    @apply flex items-center gap-3 mb-2 last:mb-0;
    .name {
      @apply flex items-center gap-2 w-[200px];
    }
  }
}
</style>
