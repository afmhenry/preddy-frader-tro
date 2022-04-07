import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import HighchartsVue from 'highcharts-vue'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(HighchartsVue)
  .mount('#app')
