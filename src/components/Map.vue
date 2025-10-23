<template>
  <div>
    <div v-if="label || autoComplete" class="input_wrapper mb-2">
      <p v-if="label" class="label capitalize items-center text-sub mb-2">
        {{ label }}
      </p>

      <GMapAutocomplete
        v-if="autoComplete"
        :placeholder="$t('LABELS.searchForLocation')"
        @place_changed="setPlace"
      >
      </GMapAutocomplete>
    </div>

    <GMapMap
      v-if="center"
      :center="center"
      :zoom="10"
      map-type-id="terrain"
      :options="{
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
      }"
      style="width: 100%; height: 350px"
      @click="getClickedLatLng"
    >
      <template v-if="canDraw">
        <GMapMarker
          :position="center"
          :clickable="true"
          :draggable="draggable"
          @dragend="openMarker"
          :icon="customIcon"
        ></GMapMarker>

        <GMapPolygon
          :paths="paths"
          :options="polygonOptions"
          @paths_changed="handlePathChanges"
          ref="polylineRef"
          deepWatch
        />
        <!-- editable -->

        <GMapMarker
          v-for="(path, index) in paths"
          :key="index"
          :position="path"
          :clickable="true"
          :draggable="true"
          @dragend="markerdraged(index, $event)"
          @click="removeMarker(index)"
          :icon="customIcon"
        >
          <!-- :icon="customIcon" -->
        </GMapMarker>
      </template>
      <!-- @path_changed="handlePathChanges" -->
      <GMapMarker
        v-else
        :position="center"
        :clickable="true"
        :draggable="draggable"
        @dragend="openMarker"
        :icon="customIcon"
      ></GMapMarker>
    </GMapMap>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { reactive, onMounted, ref, watch } from "vue";
import customIcon from "/marker.png";
const props = defineProps({
  location: {
    required: false,
  },
  label: {
    required: false,
    default: false,
  },
  autoComplete: {
    type: Boolean,
    required: false,
    default: true,
  },
  draggable: {
    type: Boolean,
    required: false,
    default: true,
  },
  canDraw: {
    type: Boolean,
    required: false,
    default: false,
  },
  area: {
    type: Array,
    required: false,
  },
});

const latFiled = useField("location.lat");
const lngFiled = useField("location.lng");
const areas = useField("areas");
const paths = ref([]);
const polylineRef = ref();
const center = reactive({
  lat: 0,
  lng: 0,
  address: "",
});
const emit = defineEmits(["setLocation", "setPath", "paths_changed"]);

function removeMarker(index) {
  paths.value.splice(index, 1);

  areas.setValue(paths.value);
}

function markerdraged(index, e) {
  let marker = { lat: e.latLng.lat(), lng: e.latLng.lng() };

  paths.value[index] = marker;
  polylineRef.value.paths[index] = marker;
  areas.setValue(paths.value);
}

function openMarker(place) {
  center.lat = +place.latLng.lat().toFixed(7);
  center.lng = +place.latLng.lng().toFixed(7);
  latFiled.setValue(center.lat);
  lngFiled.setValue(center.lng);

  emit("setLocation", center);
}
function setPlace(place) {
  center.lat = +place.geometry.location.lat();
  center.lng = +place.geometry.location.lng();
  center.address = place.formatted_address;
  latFiled.setValue(center.lat);
  lngFiled.setValue(center.lng);
  paths.value = [];

  emit("setLocation", center);
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((place) => {
      center.lat = +place.coords.latitude.toFixed(7);
      center.lng = +place.coords.longitude.toFixed(7);
      latFiled.setValue(center.lat);
      lngFiled.setValue(center.lng);
    });
    emit("setLocation", center);
  }
}

const getClickedLatLng = (event) => {
  let obj = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  if (props.canDraw) {
    paths.value.push(obj);

    areas.setValue(paths.value);
  }
};

const polygonOptions = {
  strokeColor: "#FDB933",
  strokeOpacity: 0.8,
  strokeWeight: 3,
  fillColor: "#FDB933",
  fillOpacity: 0.35,
};

watch(
  () => props.area,
  (values) => {
    if (values && values.length) paths.value = values;
  },
  { deep: true, immediate: true }
);
watch(
  () => props.location,
  (location) => {
    center.lat = +location.lat;
    center.lng = +location.lng;
    latFiled.setValue(center.lat);
    lngFiled.setValue(center.lng);
  },
  { deep: true, immediate: true }
);

const handlePathChanges = (newPaths) => {
  paths.value = newPaths.Fg[0].Fg.map((item) => ({
    lat: item.lat(),
    lng: item.lng(),
  }));
  console.table(paths.value);
  emit("setPath", paths.value);
};

onMounted(() => {
  if (props.location?.lat && props.location?.lng) {
    center.lat = +props.location.lat;
    center.lng = +props.location.lng;
    latFiled.setValue(center.lat);
    lngFiled.setValue(center.lng);
  } else {
    getCurrentLocation();
  }
});
</script>
