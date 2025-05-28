<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class="text-white header-right-align" height-hint="98">
      <Header></Header>
    </q-header>

    <q-page-container>
      <div class="filter-container">
        <q-input
          outlined
          v-model="priceMin"
          label="賃料下限"
          class="filter-input"
        />
        <q-input
          outlined
          v-model="priceMax"
          label="賃料上限"
          class="filter-input"
        />
        <q-select
          use-input
          :options="filteredLines"
          outlined
          hide-selected
          fill-input
          v-model="line"
          @filter="filterFnLines"
          @input-value="setline"
          @blur="allStations = liner.getStations(line)"
          label="路線"
          class="filter-input"
        />
        <q-select
          :options="allStations"
          outlined
          v-model="stations"
          multiple
          label="路線"
          class="filter-input"
        />
        <q-select
          outlined
          use-input
          v-model="floorSelection"
          :options="floorOptions"
          label="所在階"
          class="filter-select"
          filled
        />
        <q-btn
          label="検索"
          color="primary"
          class="filter-button"
          @click="search"
          style="flex: 0 0 auto; background-color: #001858; color: #fef6e4"
        />
      </div>
      <div class="results-container">
        <div
          v-for="property in itandibbHouses.buildings"
          :key="property.property_id"
          class="property-card"
        >
          <div class="property-header">
            <img
              :src="property.image?.url"
              alt="Property Image"
              class="property-image"
            />
            <div class="property-info">
              <h3>{{ property.name }}</h3>
              <p>{{ property.address_text }}</p>
              <p>{{ property.nearby_train_station_texts.join(', ') }}</p>
              <p>
                {{ property.building_age_text }} / {{ property.story_text }}
              </p>
            </div>
          </div>
          <div class="rooms-container">
            <q-card
              v-for="room in property.rooms"
              :key="room.room_property_id"
              class="room-card"
              flat
              bordered
              @mouseover="hover = true"
              @mouseleave="hover = false"
            >
              <q-img
                :src="room.madori_image?.url || 'default-room-image.jpg'"
                alt="Room Layout"
                class="room-image"
                ratio="1"
              />
              <q-card-section class="room-info">
                <q-item>
                  <q-item-section>
                    <div>
                      部屋番号: {{ room.room_number }} | 賃料:
                      {{ room.rent_text }} | 敷金: {{ room.shikikin_text }} /
                      礼金: {{ room.reikin_text }} | 専有面積:
                      {{ room.floor_area_text }} | 間取り:
                      {{ room.layout_text }}
                      <a
                        :href="`https://itandibb.com/rent_rooms/${room.room_property_id}`"
                        target="_blank"
                        >查看详情</a
                      >
                    </div>
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Itandibb from '../class/Itandibb'
import Liner from '../class/Liner'
// @ts-ignore
import Header from '../components/Header.vue'
import { useStore } from '../store'

let liner = null
let itandibb = null
const store = useStore()
const allLines = ref([])
const allStations = ref([])
const priceMin = ref('')
const priceMax = ref('')
const line = ref('')
const stations = ref([])
let itandibbHouses = ref([])
const floorSelection = ref('')
const floorOptions = [
  { label: '1階', value: '1' },
  { label: '2階以上', value: '2+' }
]
const filteredLines = ref([])
onMounted(() => {
  init()
  filteredLines.value = allLines.value // Initialize filteredLines with all options
})

watch(line, newValue => {
  console.log(`line changed to: ${newValue}`)
})

function init () {
  itandibb = new Itandibb()
  liner = new Liner()
  try {
    itandibb.init()
    
    store.setItandibbInstance(itandibb)

    allLines.value = liner.getLines()
  } catch (error) {
    console.error('Error initializing Itandibb in Main.vue:', error)
  }
}

const filterFnLines = (val, update) => {
  if (val === '') {
    filteredLines.value = allLines.value
    update(() => {
      filteredLines.value = allLines.value
    })
    return
  }
  update(() => {
    filteredLines.value = allLines.value.filter(line =>
      line.toLowerCase().includes(val.toLowerCase())
    )
  })
}

const setline = val => {
  line.value = val
}

const search = async () => {
  try {
    const conditions = {
      line: line.value,
      stations: stations.value,
      priceMin: priceMin.value,
      priceMax: priceMax.value,
      floorSelection: floorSelection.value
    }
    const response = await itandibb.search(conditions)
    itandibbHouses.value = response // Store the fetched data
    console.log('Fetched properties:', itandibbHouses.value)
  } catch (error) {
    console.error('Error fetching properties:', error)
  }
}
</script>

<style scoped>
/* Header styles */
.q-header {
  background-color: #fef6e4; /* Background color from the palette */
  color: #001858; /* Text color from the palette */
  padding: 10px 20px; /* Added padding */
}

.header-right-align {
  display: flex;
  justify-content: flex-end;
}

/* Filter container styles */
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Reduced gap for compact layout */
  padding: 30px; /* Adjusted padding for balance */
  background: linear-gradient(
    135deg,
    #fef6e4,
    #f3e8d9
  ); /* Gradient background */
  border-radius: 16px; /* Slightly more rounded corners */
  justify-content: center; /* Centered content */
}

/* Input and select styles */
.filter-input,
.filter-select {
  flex: 1 1 calc(20% - 16px); /* Smaller size for inputs */
  min-width: 180px; /* Reduced minimum width */
  background-color: #fef6e4; /* Match theme background */
  border: 1px solid #dcdcdc; /* Light border for inputs */
  border-radius: 8px; /* Rounded corners */
  padding: 8px; /* Reduced inner padding */
  font-family: 'Georgia', serif; /* Elegant font */
  font-size: 14px; /* Slightly smaller font size */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Subtle shadow for inputs */
  transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease; /* Smooth hover and focus effects */
}

.filter-input:hover,
.filter-select:hover {
  transform: translateY(-1px); /* Slight lift on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Stronger shadow on hover */
}

.filter-input:focus,
.filter-select:focus {
  border-color: #001858; /* Highlight border on focus */
  box-shadow: 0 4px 10px rgba(0, 24, 88, 0.2); /* Stronger shadow on focus */
}

.filter-input .q-field__control,
.filter-select .q-field__control {
  font-family: 'Georgia', serif; /* Elegant font */
  font-size: 14px; /* Slightly smaller font size */
  color: #001858; /* Text color matching the theme */
}

.filter-input .q-field__label,
.filter-select .q-field__label {
  font-weight: bold; /* Bold labels for better visibility */
  color: #001858; /* Label color matching the theme */
}

/* Button styles */
.filter-button {
  border-radius: 8px; /* Rounded corners for the button */
  font-family: 'Georgia', serif; /* Match input font */
  font-size: 14px; /* Consistent font size */
  padding: 10px 20px; /* Adjusted padding for better appearance */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth hover effect */
}

.filter-button:hover {
  background-color: #f3e8d9; /* Lighter theme color on hover */
  color: #001858; /* Text color on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

/* Results container styles */
.results-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.property-card {
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fef6e4;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
}

.property-header {
  display: flex;
  gap: 16px;
}

.property-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.property-info {
  flex: 1;
}

.rooms-container {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.room-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.3s ease;
}

.room-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Shadow on hover */
}

.room-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.room-info {
  flex: 1;
  font-size: 14px;
  color: #001858;
}

.details-button {
  margin-left: 8px;
  font-size: 12px;
}
</style>
