<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
    <div
      class="input_wrapper"
      :class="{ error: !meta.valid && meta.touched }"
      v-bind="getRootProps()"
    >
      <label v-if="label" :for="id" class="label">{{ label }}</label>

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
          :multiple="multiple"
        />

        <input type="text" class="hidden" :name="name" v-bind="field" />

        <!-- Upload area / preview -->
        <label
          :for="id"
          class="text-xl text-center p-7 rounded-lg flex flex-col justify-center items-center gap-3 cursor-pointer relative"
        >
          <template v-if="preview && no_preview">
            <img
              class="mx-auto w-[180px] h-[180px] object-cover rounded-lg border"
              :src="preview"
              alt="Preview"
            />
            <button
              v-if="deleteUrl"
              type="button"
              @click="removeImage"
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

        <!-- Upload progress -->
        <div class="flex gap-2 pb-7" v-if="uploadPercentage > 0">
          <img src="@/assets/images/icons/file.png" alt="file upload" />
          <div class="flex flex-col flex-1">
            <h5 class="flex items-center justify-between">
              <span class="text-[#191D23]">{{ $t("LABELS.uploadingFile") }}</span>

              <!-- Upload finished -->
              <div
                v-if="uploadFinshed"
                class="text-main font-bold flex items-center gap-2"
              >
                <i
                  class="fas fa-check rounded-full bg-[#047857] text-white border p-1"
                ></i>
                <button
                  type="button"
                  @click="cancelReq"
                  class="text-main border w-6 h-6 rounded-full border-main transition hover:bg-main hover:text-white"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <!-- Uploading in progress -->
              <div
                v-else
                class="text-main font-bold flex items-center gap-2"
              >
                <span>{{ uploadPercentage + "%" }}</span>
                <button
                  type="button"
                  @click="cancelReq"
                  class="text-main border w-6 h-6 rounded-full border-main transition hover:bg-main hover:text-white"
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

      <Image
        width="80"
        height="60"
        class="rounded-lg h-[60px] w-[80px] object-cover border"
        image-class="rounded-lg h-[60px] w-[80px] object-cover border-line preview_image"
        :src="preview.url"
        alt="Preview"
        preview
      />
    </div>
  </div>
</template>

<script setup>
import Image from "primevue/image";
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useDropzone } from "vue3-dropzone";
import { useI18n } from "vue-i18n";
import { useField } from "vee-validate";

const { t } = useI18n();

const props = defineProps({
  accept: String,
  no_preview: Boolean,
  notPreview: Boolean,
  multiple: Boolean,
  returnFile: Boolean,
  baseUrl: String,
  attachment: { type: String, default: "attachment" },
  deleteUrl: String,
  modalName: { type: String, required: true },
  modalType: { type: String, required: true, default: "image" },
  id: String,
  name: String,
  label: String,
  itemValue: String,
  image: String,
});

const emit = defineEmits(["update:itemValue", "update:image", "uploading"]);

const preview = ref(null);
const uploadPercentage = ref(0);
const uploadFinshed = ref(false);
const dragOver = ref(false);
const refFile = ref();
let request = null;

const inputField = useField(props.name);
const { getRootProps } = useDropzone({ onDrop });

function onDrop(acceptFiles) {
  uploadFile(acceptFiles[0]);
}

function fullPath(p) {
  if (!p) return "";

  if (typeof p === "object" && p.url) {
    return p.url;
  }
  console.log(p);
  return p;
}



function uploadFile(file) {
  if (!file) return;

  uploadPercentage.value = 0;

  request = axios.CancelToken.source();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", props.modalName);
  formData.append("attachment_type", props.modalType);

  emit("uploading", true);

  axios({
    url: props.attachment,
    method: "POST",
    data: formData,
    baseURL: props.baseUrl || import.meta.env.VITE_GENERAL_URL + "/general",
    cancelToken: request.token,
    onUploadProgress: (e) => {
      uploadPercentage.value = Math.round((e.loaded * 100) / e.total);
    },
  })
    .then((res) => {
      const uploadedPath = res.data.data?.path || res.data?.path || "";
      const previewUrl = fullPath(uploadedPath);

      preview.value = previewUrl;
      uploadPercentage.value = 100;
      uploadFinshed.value = true;

      emit("update:itemValue", previewUrl);
      emit("update:image", uploadedPath);
      inputField.setValue(uploadedPath);
      emit("uploading", false);
    })
    .catch((err) => {
      cancelReq();
      toast.error(err.response?.data?.message || t("STATUS.uploadCanceled"));
    });
}

function removeImage() {
  if (!props.deleteUrl) return cancelReq();

  axios
    .delete(props.deleteUrl, {
      baseURL: import.meta.env.VITE_GENERAL_URL + "/general/attachment",
    })
    .then(() => {
      cancelReq();
    })
    .catch(() => {
      toast.error(t("STATUS.uploadCanceled"));
      cancelReq();
    });
}

function cancelReq() {
  if (request) request.cancel();
  request = null;
  uploadPercentage.value = 0;
  preview.value = null;
  uploadFinshed.value = false;
  emit("update:itemValue", "");
  emit("update:image", "");
  inputField.setValue("");
}
watch(
  () => props.itemValue,
  (val) => (preview.value = val ? fullPath(val) : null)
);
onMounted(() => {
  if (props.itemValue) preview.value = fullPath(props.itemValue);
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
      > div {
        @apply flex;
      }
    }
    &.hid_input {
      input {
        @apply hidden;
      }
    }
  }
}
</style>
