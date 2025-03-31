<template>
    <q-dialog v-model="visible" persistent transition-show="scale" transition-hide="scale">
        <q-card class="cute-card">
            <q-card-section>
                <div class="text-h6 cute-title">Settings</div>
            </q-card-section>

            <q-card-section>
                <q-p>itandibb</q-p>
                <q-input v-model="account" label="Account" class="cute-input" />
                <q-input v-model="password" label="Password" type="password" class="cute-input" />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" @click="close" class="cute-btn" />
                <q-btn flat label="Save" color="primary" @click="save" class="cute-btn" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from '../store'

const visible = ref(false)
const store = useStore()
// TODO:
// 优化account和password的命名，应该每个网站在store中创建一个对象分别保存account和password
const account = ref(store.account)
const password = ref(store.password)

const toggle = () => {
    visible.value = !visible.value
}

const close = () => {
    visible.value = false
}

const save = () => {
    store.setAccount(account.value)
    store.setPassword(password.value)
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
</style>
