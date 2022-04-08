import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import HighchartsVue from 'highcharts-vue'

loadFonts()

const app = createApp(App)
app.config.unwrapInjectedRef = true
app.use(vuetify)
  .use(HighchartsVue)
  .mount('#app')
