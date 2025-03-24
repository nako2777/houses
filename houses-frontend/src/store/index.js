import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => ({
        account: localStorage.getItem('account') || '',
        password: localStorage.getItem('password') || ''
    }),
    actions: {
        setAccount(account) {
            this.account = account
            localStorage.setItem('account', account)
        },
        setPassword(password) {
            this.password = password
            localStorage.setItem('password', password)
        }
    }
})
