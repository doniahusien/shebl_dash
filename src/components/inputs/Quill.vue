<template>
  <VeeField :id="id" type="text" :name="name" v-slot="{ meta }">
    <div
      class="input_wrapper relative"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <QuillEditor
        :options="toolbarOptions"
        ref="editor"
        @text-change="updateValue"
        contentType="html"
        theme="snow"
        v-model:content="content"
      />

      <VeeErrorMessage :name="name" as="div" class="text-red-500" />
    </div>
  </VeeField>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useField } from "vee-validate";
import { onMounted, ref } from "vue";

const props = defineProps({
  value: {
    required: false,
  },

  id: {
    required: true,
  },
  name: {
    required: true,
  },
  label: {
    required: false,
  },
});

const emit = defineEmits(["getContent", "update:value"]);

const toolbarOptions = {
  modules: {
    toolbar: {
      container: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [
          {
            color: [
              "#6A449A",
              "#F88C43",
              "#3A3A3A",
              "#8D8D8D",
              "#D1DEE1",
              "#fff",

              "#000",
            ],
          },
          {
            background: [
              "#6A449A",
              "#F88C43",
              "#3A3A3A",
              "#8D8D8D",
              "#D1DEE1",
              "#fff",

              "#000",
            ],
          },
        ],
        ["link", "image"],
        ["clean"],
      ],
    },
  },
};

const editor = ref();
const content = ref("");

const itemField = useField(props.name);

function updateValue() {
  if (editor.value.getHTML().replace(/<[^>]*>/g, "").length > 0) {
    itemField.setValue(editor.value.getHTML());
  } else {
    itemField.setValue(null);
  }
}

// watch(
//   () => props.value,
//   (newVal) => {
//     if (newVal) {
//       content.value = newVal;

//       if (newVal.replace(/<[^>]*>/g, "").length > 0) {
//         itemField.setValue(newVal);
//       } else {
//         itemField.setValue(null);
//       }
//     }
//   },
//   {
//     deep: true,
//   }
// );
onMounted(() => {
  if (itemField.value.value) {
    content.value = itemField.value.value;
  }
});

// onMounted(() => {
//   if (props.value) {
//     content.value = props.value;
//     if (content.value.replace(/<[^>]*>/g, "").length > 0) {
//       itemField.setValue(content.value);
//     } else {
//       itemField.setValue(null);
//     }
//   }
// });
</script>
<style lang="scss">
.quillWrapper {
  .ql-formats {
    margin: 0 !important;
  }
  .ql-picker-options {
    height: 130px;
    overflow-y: auto;
  }
}
span.ql-formats:first-child > .ql-picker,
span.ql-header.ql-picker {
  border: 1px solid var(--main_color);
  display: flex;
  height: 100%;
  padding: 2px;
  box-shadow: inset 0 1px 1px -1px rgba(0, 0, 0, 0.2);
  background: white;
  width: 200px;
}
.ql-toolbar.ql-snow {
  @apply flex items-center flex-wrap m-0 gap-1;
}
.ql-toolbar.ql-snow .ql-formats {
  margin: 0 !important;
}
.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
  fill: var(--titles_color) !important;
}
.ql-editor.ql-blank::before {
  color: rgba(0, 0, 0, 0.3) !important;
  font-style: normal !important;
}
.ql-icon-picker {
  padding: 0 !important;
}
.ql-formats button:hover,
.ql-formats .ql-picker:hover {
  background: var(--shadow_color) !important;
}

button {
  @apply w-fit;
  &.ql-showHtml {
    @apply text-text flex;

    &::after {
      content: "</>";
      //   @apply text-text flex;
    }
  }
}
[dir="rtl"] {
  .ql-editor {
    text-align: right;
  }
}
</style>
