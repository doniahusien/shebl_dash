<template>
  <div>
    <form @submit.prevent class="w-full">
      <div class="register_form py-11">
        <VeeForm
          as="div"
          @submit="onSubmit"
          v-slot="{ meta }"
          :validation-schema="schema"
        >
          <form>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <base-input
                id="name"
                name="name"
                placeholder="placeholder"
                label="label"
              />

              <div>
                <base-date
                  type="date"
                  id="date"
                  name="date"
                  placeholder="placeholder"
                  label="label"
                />
              </div>
              <div>
                <base-input
                  id="region"
                  name="region"
                  placeholder="placeholder"
                  label="label"
                />
              </div>

              <div class="md:col-span-2">
                <base-file
                  id="image"
                  name="image"
                  placeholder="image"
                  label="image"
                />
              </div>
            </div>
            <base-button
              type="submit"
              class="w-fit base-btn"
              name="next"
              :meta="meta"
            />
          </form>
        </VeeForm>
      </div>
    </form>

    <v-data-table
      :headers="headers"
      :items="desserts"
      item-value="name"
      class="elevation-1"
    />
  </div>
</template>

<script setup>
import * as yup from "yup";
import { configure } from "vee-validate";

const itemsPerPage = 5;
const headers = [
  {
    title: "Dessert (100g serving)",
    align: "start",
    sortable: false,
    key: "name",
  },
  { title: "Calories", align: "end", key: "calories" },
  { title: "Fat (g)", align: "end", key: "fat" },
  { title: "Carbs (g)", align: "end", key: "carbs" },
  { title: "Protein (g)", align: "end", key: "protein" },
  { title: "Iron (%)", align: "end", key: "iron" },
];
const desserts = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: "1",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: "0",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: "6",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: "7",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: "16",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: "1",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: "2",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: "8",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: "45",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: "22",
  },
];

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const schema = yup.object().shape({
  name: yup.string().required(),

  image: yup
    .mixed()
    .required()
    .test("fileSize", "File is too large", (value) => {
      // Adjust max file size as needed (e.g., 1MB)
      return !value || value.size <= 1024 * 1024; // 1MB in bytes
    })
    .test("fileType", "Invalid file type", (value) => {
      // Specify allowed file types (e.g., JPEG, PNG, PDF)
      const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
      return !value || allowedFileTypes.includes(value.type);
    })
    .nullable(),

  date: yup.string().required(),
});

function onSubmit(response) {
  console.log(response);
}
</script>
