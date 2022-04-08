import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import HighchartsVue from 'highcharts-vue'

if (window.location.hash && window.location.hash.includes("refresh")) {
  // Do nothing
} else  {
  loadFonts()

  const app = createApp(App)
  app.config.unwrapInjectedRef = true
  app.use(vuetify)
    .use(HighchartsVue)
    .mount('#app')
  
}

