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
        class="upload border border-main hid_input rounded-xl p-2 bg-main/10"
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
          class="text-xl text-center p-7 rounded-lg !flex flex-col justify-center items-center gap-3 cursor-pointer"
        >
          <template v-if="preview && no_preview">
            <img
              width="180"
              height="180"
              class="mx-auto w-[180px] h-[180px] object-cover"
              :src="preview"
              @error="imgError(imgErrors)"
              alt=""
            />
            <button
              type="button"
              @click="removeImage"
              v-if="deleteUrl"
              class="absolute flex items-center justify-center border w-6 h-6 bg-main rounded-full -top-1 -left-1 text-base z-10"
            >
              <i class="fas fa-times text-red-500"></i>
            </button>
          </template>
          <template v-else>
            <img
              src="@/assets/images/icons/file.png"
              class="mx-auto mb-3"
              alt="Upload"
            />
            <span class="text-sm">
              {{ $t("LABELS.dropFilesHereOrClickToUpload") }}
            </span>
          </template>
        </label>

        <div class="flex gap-2 pb-7">
          <img src="@/assets/images/icons/file.png" alt="file upload" />
          <div class="flex flex-col flex-1">
            <h5 class="flex items-center justify-between">
              <span class="text-[#191D23]">
                {{ $t("LABELS.uploadingFile") }}</span
              >
              <div
                class="text-main font-bold flex items-center gap-2"
                v-if="uploadFinshed"
              >
                <i
                  class="fas fa-check rounded-full bg-[#047857] text-white border p-1"
                ></i>
                <button
                  type="button"
                  @click="cancelReq"
                  class="text-main border w-6 h-6 rounded-full border-main transition hover:bg-main hover:!text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div
                class="text-main font-bold flex items-center gap-2"
                v-if="uploadPercentage && !uploadFinshed"
              >
                <span class="text-main font-bold">
                  {{ uploadPercentage + "%" }}
                </span>

                <button
                  type="button"
                  @click="cancelReq"
                  class="text-main border w-6 h-6 rounded-full border-main transition hover:bg-main hover:!text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </h5>
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
        class="text-red-500 text-center absolute ms-10"
      />
    </div>
  </VeeField>

  <div
    v-if="preview && !no_preview && !notPreview"
    class="flex items-center gap-3 flex-wrap mt-2"
  >
    <div class="relative">
      <button
        class="absolute border w-6 h-6 bg-main rounded-full -top-1 -left-1 text-base z-10"
        type="button"
        @click="cancelReq"
      >
        <i class="fas fa-times text-white"></i>
      </button>

      <video
        v-if="modalType == 'file'"
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
    type: String,
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
    default: "attachment",
  },
  deleteUrl: {
    required: false,
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
        emit("update:image", res.data.path);
        emit("uploading", false);
        inputField.setValue(res.data.path);
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

function removeImage() {
  if (props.deleteUrl) {
    axios({
      url: props.deleteUrl,
      method: "DELETE",
      baseURL: import.meta.env.VITE_GENERAL_URL + "/general",
    })
    .then(() => {
      emit("update:itemValue", "");
      emit("update:image", "");
      cancelReq();
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

