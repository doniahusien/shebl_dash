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
      :zoom="15"
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
    >
      <GMapMarker
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
import axios from "axios";
import { useField } from "vee-validate";
import { reactive, onMounted, ref, watch } from "vue";
import customIcon from "/marker.png";
const props = defineProps({
  location: {
    required: false,
  },
  locationAddress: {
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
});

const latFiled = useField("location.lat");
const lngFiled = useField("location.lng");
const localtionFiled = useField("locationAddress");

const center = reactive({
  lat: 0,
  lng: 0,
  address: "",
});
const emit = defineEmits(["setLocation", "setPath", "paths_changed"]);

function getFormattedAddress(lat, lng, locationAddress) {
  if (locationAddress) {
    return;
  }
  const apiKey = "AIzaSyA8qi0TK3EDod0LlTXbQFf_DyEptiGgPFU"; // Replace with your Google Maps API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.results.length) {
        center.address = res.results[0].formatted_address;
        emit("setLocation", center);
      } else {
        center.address = res.plus_code.compound_code;
        emit("setLocation", center);
      }
    });
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
  localtionFiled.setValue(place.formatted_address);
  latFiled.setValue(center.lat);
  lngFiled.setValue(center.lng);

  emit("setLocation", center);
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((place) => {
      if (place.coords.latitude) {
        center.lat = +place.coords.latitude.toFixed(7);
        latFiled.setValue(center.lat);
      }
      if (place.coords.longitude) {
        center.lng = +place.coords.longitude.toFixed(7);

        lngFiled.setValue(center.lng);
      }
      if (center.lat && center.lng) {
        getFormattedAddress(center.lat, center.lng);
      }
    });
    emit("setLocation", center);
  }
}

watch(
  () => props.location,
  (location) => {
    if (location.lat) {
      center.lat = +location.lat;

      latFiled.setValue(center.lat);
    }
    if (location.lng) {
      center.lng = +location.lng;
      lngFiled.setValue(center.lng);
    }
    if (center.lat && center.lng) {
      getFormattedAddress(center.lat, center.lng, props.locationAddress);
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (props.location?.lat && props.location?.lng) {
    if (props.location.lat) {
      center.lat = +props.location.lat;

      latFiled.setValue(center.lat);
    }
    if (props.location.lng) {
      center.lng = +props.location.lng;
      lngFiled.setValue(center.lng);
    }
    if (center.lat && center.lng) {
      getFormattedAddress(center.lat, center.lng, props.locationAddress);
    }
  } else {
    getCurrentLocation();
  }
});
</script>
