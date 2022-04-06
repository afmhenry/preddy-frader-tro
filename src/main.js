import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import FlagIcon from 'vue-flag-icon'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(FlagIcon)
  .mount('#app')
