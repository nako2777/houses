<template>
    <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale">
        <q-card class="cute-card">
            <q-card-section>
                <div class="text-h6 cute-title">Settings</div>
            </q-card-section>

            <q-card-section>
                <div class="website-section">
                    <div class="website-title">itandibb</div>
                    <q-input v-model="credentials.itandibb.account" label="Account" class="cute-input" />
                    <q-input v-model="credentials.itandibb.password" label="Password" type="password" class="cute-input" />
                </div>
                
                <div class="website-section">
                    <div class="website-title">いえらぶ BB</div>
                    <q-input v-model="credentials.ierabubb.account" label="Account" class="cute-input" />
                    <q-input v-model="credentials.ierabubb.password" label="Password" type="password" class="cute-input" />
                </div>
                
                <div class="website-section">
                    <div class="website-title">いい生活</div>
                    <q-input v-model="credentials.iiseikatsu.account" label="Account" class="cute-input" />
                    <q-input v-model="credentials.iiseikatsu.password" label="Password" type="password" class="cute-input" />
                </div>
                
                <div class="website-section">
                    <div class="website-title">reins</div>
                    <q-input v-model="credentials.reins.account" label="Account" class="cute-input" />
                    <q-input v-model="credentials.reins.password" label="Password" type="password" class="cute-input" />
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" @click="close" class="cute-btn" />
                <q-btn flat label="Save" color="primary" @click="save" class="cute-btn" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from '../store'

const visible = ref(false)
const store = useStore()

// Use reactive object to store all website credentials
const credentials = reactive({
    itandibb: {
        account: store.getWebsiteCredential('itandibb', 'account'),
        password: store.getWebsiteCredential('itandibb', 'password')
    },
    ierabubb: {
        account: store.getWebsiteCredential('ierabubb', 'account'),
        password: store.getWebsiteCredential('ierabubb', 'password')
    },
    iiseikatsu: {
        account: store.getWebsiteCredential('iiseikatsu', 'account'),
        password: store.getWebsiteCredential('iiseikatsu', 'password')
    },
    reins: {
        account: store.getWebsiteCredential('reins', 'account'),
        password: store.getWebsiteCredential('reins', 'password')
    }
})

const toggle = () => {
    visible.value = !visible.value
}

const close = () => {
    visible.value = false
}

const save = () => {
    // Save credentials for each website
    for (const [website, cred] of Object.entries(credentials)) {
        store.setWebsiteCredential(website, 'account', cred.account)
        store.setWebsiteCredential(website, 'password', cred.password)
    }
    close()
}

defineExpose({ toggle })
</script>

<style scoped>
.cute-card {
    width: 85vw; /* Increased width */
    height: 75vh;
    margin: 0 auto;
    border-radius: 15px;
    background-color: #fef6e4; /* Background color from the palette */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto; /* Add scrolling for many inputs */
}

.cute-title {
    font-family: 'Comic Sans MS', cursive, sans-serif;
    color: #001858; /* Headline color from the palette */
}

.cute-input {
    margin-bottom: 15px;
}

.cute-btn {
    background-color: #f582ae; /* Button color from the palette */
    color: #001858; /* Button text color from the palette */
    border-radius: 10px;
}

.website-section {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.5);
}

.website-title {
    font-weight: bold;
    color: #001858;
    margin-bottom: 10px;
    font-size: 1.1em;
}
</style>
