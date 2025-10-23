<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
    <!-- :class="dragOver ? 'bg-warning' : 'bg-gray-100'" -->

    <div
      class="input_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
      v-bind="getRootProps()"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <div
        class="upload border border-primary hid_input rounded-xl p-2 bg-primary/10"
        :class="{
          uploading: uploadPercentage,
          'border-dashed bg-gray-100 !cursor-move': dragOver,
        }"
        @dragover="dragOver = true"
        @dragleave="dragOver = false"
      >
        <input
          ref="refFile"
          type="file"
          :id="id"
          @change="uploadFile($event.target.files[0])"
          class="hidden"
          :accept="accept"
          :multiple="multiple ? true : false"
        />

        <input type="text" class="hidden" :name="name" v-bind="field" />
        <label
          :for="id"
          class="text-xl text-center rounded-lg !flex justify-between items-center gap-3 cursor-pointer"
        >
          <div class="flex items-center gap-1">
            <img src="@/assets/images/icons/file.png" class="" alt="Upload" />
            <span class="text-sm" v-if="modalType == 'file'">
              {{ $t("LABELS.dropOnlyFilesHereOrClickToUpload") }}
            </span>
            <span class="text-sm" v-else>
              {{ $t("LABELS.dropFilesHereOrClickToUpload") }}
            </span>
          </div>
          <div
            class="text-primary font-bold flex items-center gap-2"
            v-if="uploadPercentage && !uploadFinshed"
          >
            <span class="text-primary font-bold">
              {{ uploadPercentage + "%" }}
            </span>
            <button
              type="button"
              @click.stop="cancelReq"
              class="text-primary border w-6 h-6 rounded-full border-primary transition hover:bg-primary hover:!text-white"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </label>

        <div class="flex gap-2">
          <div class="flex flex-col flex-1">
            <div class="rounded-lg h-1 w-full bg-[#E7EAEE] mt-auto">
              <div
                class="h-2 rounded-lg bg-[#047857] transition"
                :style="`width:${uploadPercentage}%;`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-red-500"
      />
    </div>
  </VeeField>

  <div
    v-if="preview && !no_preview && !notPreview"
    class="flex items-center gap-3 flex-wrap mt-1"
  >
  
    <div class="relative">
      <div
        v-if="deleteUrl && preview_id"
        class="absolute flex items-center justify-center border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
      >
        <Deleter
          method="delete"
          :url="GENERAL_URL + '/general/' + deleteUrl + '/' + preview_id"
          icon="fas fa-times text-white"
          @remove="cancelReq"
          :id="preview_id"
        />
      </div>
      <button
      v-else
        class="absolute border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
        type="button"
        @click="cancelReq"
      >
        <i class="fas fa-times text-white"></i>
      </button>
      <video
        v-if="modalType == 'video'"
        width="100%"
        height="80vh"
        class="size-14 object-cover rounded-lg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      >
        <source :src="preview" type="video/mp4" />
        <source :src="preview" type="video/webm" />
      </video>
       <a :href="preview" target="_blank" class="border border-border rounded-lg h-[40px] w-[80px] object-cover flex items-center justify-center"
       v-else-if="modalType == 'file'"
       >
       <svg-icon name="pdf" />
       {{$t('LABELS.file')}}
       </a>
      <Image
        v-else
        width="80"
        height="60"
        class="rounded-lg h-[60px] w-[80px] object-cover border"
        image-class="rounded-lg h-[60px] w-[80px] object-cover border-line preview_image"
        :src="preview"
        alt=""
        preview
      >
      </Image>
    </div>
  </div>
</template>

<script setup>
import Image from "primevue/image";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useDropzone } from "vue3-dropzone";
import { useI18n } from "vue-i18n";

import { useField } from "vee-validate";
const GENERAL_URL = import.meta.env.VITE_GENERAL_URL;
const { t } = useI18n();
const props = defineProps({
  accept: {
    required: false,
  },

  no_preview: {
    required: false,
    default: false,
  },
  itemValue: {
    required: true,
  },
  image: {
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
  imgErrors: {
    required: false,
  },
  placeholder: {
    required: true,
  },
  modalName: {
    required: true,
  },
  modalType: {
    required: true,
    default: "image",
  },
  notPreview: {
    required: false,
  },
  preview_id: {
    required: false,
  },
  deleteUrl: {
    required: false,
  },
  multiple: {
    type: Boolean,
  },
  returnFile: {
    required: false,
  },
  baseUrl: {
    required: false,
  },
  attachment: {
    required: false,
    default: "attachments",
  },
});
const emit = defineEmits(["update:itemValue", "update:image", "uploading"]);
const preview = ref(null);

const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop });
function onDrop(acceptFiles, rejectReasons) {
  uploadFile(acceptFiles[0]);
}

const uploadPercentage = ref(0);
const uploadFinshed = ref(false);
const refFile = ref();
let request = null;

const inputField = useField(props.name);
function uploadFile(file) {
  uploadPercentage.value = 0;
  uploadFinshed.value = false;

  if (props.returnFile) {
    dragOver.value = false;
    preview.value = URL.createObjectURL(file);
    uploadPercentage.value = 100;
    emit("update:itemValue", preview.value);
    emit("update:image", file);
    inputField.setValue(file);

    uploadFinshed.value = true;
  } else {
    request = axios.CancelToken.source();
    const frmData = new FormData();

    frmData.append("file", file);
    frmData.append("model", props.modalName.trim());
    frmData.append("attachment_type", props.modalType);
    emit("uploading", true);

    axios({
      url: props.attachment,
      method: "POST",
      data: frmData,
      headers: {
        model: props.modalName.trim(),
        type: props.modalType,
      },
      baseURL: props.baseUrl
        ? props.baseUrl
        : import.meta.env.VITE_GENERAL_URL + "/general",
      onUploadProgress: (event) =>
        (uploadPercentage.value = parseInt(
          Math.round((event.loaded / event.total) * 100)
        )),
      cancelToken: request.token,
    })
      .then((res) => {
        dragOver.value = false;
        preview.value = URL.createObjectURL(file);

        emit("update:itemValue", preview.value);
        emit("update:image", res.data.data);
        emit("uploading", false);
        inputField.setValue(res.data.data);
        uploadFinshed.value = true;
      })
      .catch((err) => {
        emit("uploading", false);
        toast.error(err.response?.data.message || t("STATUS.uploadCanceled"));
        dragOver.value = false;
        cancelReq();
      });
  }
}

function cancelReq() {
  if (request) request.cancel();
  uploadFinshed.value = false;
  uploadPercentage.value = 0;
  preview.value = null;
  emit("update:itemValue", "");
  emit("update:image", "");
  refFile.value.value = null;
  request = null;
  inputField.setValue("");
}
const dragOver = ref(false);
watch(
  () => props.itemValue,
  (newVal) => {
    if (newVal) {
      preview.value = props.itemValue;
    }
  },
  {
    deep: true,
  }
);
onMounted(() => {
  if (props.itemValue) {
    preview.value = props.itemValue;
  }
});
</script>

<style lang="scss">
.input_wrapper {
  &.upload_image {
    margin-bottom: 1.5rem;
    input {
      display: none;
    }
    label {
      cursor: pointer;
      max-width: 300px;

      margin-inline: auto;
      img {
        height: 200px;
        object-fit: cover;
        width: 100%;
        border-radius: 1rem;
      }
    }
  }
  .upload {
    > div {
      @apply hidden;
    }
    &.uploading {
      input {
        @apply hidden;
      }
      > div {
        @apply flex;
      }
    }
    &.hid_input {
      input {
        @apply hidden;
      }
      &.uploading {
        // > label {
        //   @apply hidden;
        // }
      }
    }
  }
}
</style>
