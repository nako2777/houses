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
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Itandibb from '../class/Itandibb'
import Liner from '../class/Liner'
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
    console.log('Itandibb instance stored in Pinia:', itandibb)

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
  const itandibbHouses = await itandibb.search(line.value,stations.value)
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
</style>
