import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => ({
        account: localStorage.getItem('account') || '',
        password: localStorage.getItem('password') || '',
        itandibbInstance: null, // Store the Itandibb instance
        websiteCredentials: JSON.parse(localStorage.getItem('websiteCredentials')) || {
            itandibb: { account: '', password: '' },
            ierabubb: { account: '', password: '' },
            iiseikatsu: { account: '', password: '' },
            reins: { account: '', password: '' }
        },
    }),
    actions: {
        setAccount(account) {
            this.account = account
            localStorage.setItem('account', account)
        },
        setPassword(password) {
            this.password = password
            localStorage.setItem('password', password)
        },
        setItandibbInstance(instance) {
            this.itandibbInstance = instance
        },
        /**
         * Get a specific credential for a website
         * @param {string} website - The website identifier
         * @param {string} field - The credential field (account/password)
         * @returns {string} The credential value or empty string if not found
         */
        getWebsiteCredential(website, field) {
            // Ensure website and field exist in the structure
            if (!this.websiteCredentials[website]) {
                this.websiteCredentials[website] = { account: '', password: '' };
            }

            return this.websiteCredentials[website][field] || '';
        },

        /**
         * Set a specific credential for a website
         * @param {string} website - The website identifier
         * @param {string} field - The credential field (account/password)
         * @param {string} value - The value to set
         */
        setWebsiteCredential(website, field, value) {
            // Ensure website exists in the structure
            if (!this.websiteCredentials[website]) {
                this.websiteCredentials[website] = { account: '', password: '' };
            }

            this.websiteCredentials[website][field] = value;

            // Persist to localStorage
            localStorage.setItem('websiteCredentials', JSON.stringify(this.websiteCredentials));
        }
    }
})
