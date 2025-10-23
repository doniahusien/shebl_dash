<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
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
          uploading: waitingFiles.length,
          'border-dashed bg-gray-100 !cursor-move': dragOver,
        }"
        @dragover="dragOver = true"
        @dragleave="dragOver = false"
      >
        <input
          ref="refFile"
          type="file"
          :id="id"
          @change="initUpload($event.target.files)"
          class="hidden"
          :accept="accept"
          :multiple="true"
        />

        <input type="text" class="hidden" :name="name" v-bind="field" />
        <label
          :for="id"
          class="text-xl text-center rounded-lg !flex justify-between items-center gap-3 cursor-pointer"
        >
          <div class="flex items-center gap-1">
            <img src="@/assets/images/icons/file.png" class="" alt="Upload" />
            <span class="text-sm">
              {{ $t("LABELS.dropFilesHereOrClickToUpload") }}
            </span>
          </div>
        </label>
      </div>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-red-500"
      />
    </div>
  </VeeField>
  <div class="flex gap-3">
    <div v-if="preview.length" class="flex items-center gap-3 flex-wrap mt-1">
      <div v-for="(image, index) in preview" class="relative" :key="index">
        <div
          v-if="deleteUrl && image.id"
          class="absolute flex items-center justify-center border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
        >
          <Deleter
            method="delete"
            :url="GENERAL_URL + '/general/' + deleteUrl + '/' + image.id"
            icon="fas fa-times text-white"
            @remove="remove(index)"
            :id="image.id"
          />
        </div>

        <button
          v-else
          class="absolute border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
          type="button"
          @click="remove(index)"
        >
          <i class="fas fa-times text-white"></i>
        </button>
        <Image
          width="80"
          height="60"
          class="rounded-lg h-[60px] w-[80px] object-cover border"
          image-class="rounded-lg h-[60px] w-[80px] object-cover border-line preview_image"
          :src="image.image || image"
          alt=""
          preview
        />
      </div>
    </div>
    <div v-if="waitingFiles.length" class="flex items-center gap-3 flex-wrap">
      <div
        v-for="file in waitingFiles"
        class="relative bg-gray-400 rounded-lg w-20 h-16 flex items-center justify-center text-white"
        :key="file.id"
      >
        <button
          class="absolute border w-6 h-6 bg-primary rounded-full -top-1 -left-1 text-base z-10"
          type="button"
          @click="cancelReq(file.id)"
        >
          <i class="fas fa-times text-white"></i>
        </button>
        <span class="z-[2] relative"> {{ file.precentage }}% </span>
        <div
          class="w-0 h-full inset-0 bg-green-600 absolute rounded-lg"
          :style="{ width: `${file.precentage}%` }"
        ></div>
      </div>
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
import { uuid } from "vue-uuid";
const GENERAL_URL = import.meta.env.VITE_GENERAL_URL;

const { t } = useI18n();
const props = defineProps({
  accept: {
    required: false,
  },
  deleteUrl: {
    required: false,
  },
  itemValue: {
    required: true,
  },
  image: {
    required: true,
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
  placeholder: {
    required: true,
  },
  modalName: {
    required: true,
  },
  modalType: {
    required: true,
  },

  returnFile: {
    required: false,
  },
  baseUrl: {
    required: false,
  },
});
const emit = defineEmits(["update:itemValue", "update:image", "uploading"]);
const preview = ref([]);
const images = ref([]);

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  accept: props.accept,
});

function onDrop(acceptFiles) {
  initUpload(acceptFiles);
}

const waitingFiles = ref([]);
const refFile = ref();

const inputField = useField(props.name);

function initUpload(files) {
  const fileArray = Array.from(files);

  fileArray.forEach((file) => {
    const waitingFile = {
      id: uuid.v1(),
      request: null,
      precentage: 0,
    };

    waitingFiles.value.push(waitingFile);
    uploadFileById(file, waitingFile.id);
  });
}

function uploadFileById(file, waitingFileId) {
  emit("uploading", true);

  const waitingFileIndex = waitingFiles.value.findIndex(
    (f) => f.id === waitingFileId
  );
  if (waitingFileIndex === -1) {
    console.error(`Waiting file with ID ${waitingFileId} not found`);
    return;
  }

  waitingFiles.value[waitingFileIndex].precentage = 0;

  if (props.returnFile) {
    dragOver.value = false;
    preview.value.push(URL.createObjectURL(file));
    images.value.push(file);

    waitingFiles.value[waitingFileIndex].precentage = 100;
    emit("update:itemValue", preview.value);
    emit("update:image", images.value);
    inputField.setValue(images.value);

    waitingFiles.value = waitingFiles.value.filter(
      (f) => f.id !== waitingFileId
    );
    if (!waitingFiles.value.length) emit("uploading", false);
  } else {
    const source = axios.CancelToken.source();
    waitingFiles.value[waitingFileIndex].request = source;
    const frmData = new FormData();

    frmData.append("file", file);
    frmData.append("model", props.modalName.trim());
    frmData.append("attachment_type", props.modalType);

    axios({
      url: "attachments",
      method: "POST",
      data: frmData,
      baseURL: props.baseUrl
        ? props.baseUrl
        : import.meta.env.VITE_GENERAL_URL + "/general",
      headers: {
        model: props.modalName.trim(),
        type: props.modalType,
      },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded / event.total) * 100);
        const currentIndex = waitingFiles.value.findIndex(
          (f) => f.id === waitingFileId
        );
        if (currentIndex !== -1) {
          waitingFiles.value[currentIndex].precentage = percent;
        }
      },
      cancelToken: source.token,
    })
      .then((res) => {
        dragOver.value = false;
        preview.value.push(URL.createObjectURL(file));
        images.value.push(res.data.data);

        emit("update:itemValue", preview.value);
        emit("update:image", images.value);
        inputField.setValue(images.value);

        waitingFiles.value = waitingFiles.value.filter(
          (f) => f.id !== waitingFileId
        );
      })
      .catch((err) => {
        toast.error(err.response?.data.message || t("STATUS.uploadCanceled"));
        dragOver.value = false;

        waitingFiles.value = waitingFiles.value.filter(
          (f) => f.id !== waitingFileId
        );
        emit("uploading", false);
      })
      .finally(() => {
        if (!waitingFiles.value.length) emit("uploading", false);
      });
  }
}

async function cancelReq(id) {
  const index = waitingFiles.value.findIndex((f) => f.id === id);
  if (index === -1) return;

  const file = waitingFiles.value[index];
  if (file?.request?.cancel) {
    await file.request.cancel();
    waitingFiles.value.splice(index, 1);
    refFile.value.value = null;
  }
}
const dragOver = ref(false);

function remove(index) {
  preview.value.splice(index, 1);
  images.value.splice(index, 1);

  emit("update:itemValue", preview.value);
  emit("update:image", images.value);
  inputField.setValue(images.value);
}
watch(
  () => props.itemValue,
  (newVal) => {
    if (newVal && preview.value.length === 0) {
      preview.value = [...newVal];
    }
  },
  { deep: true }
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
