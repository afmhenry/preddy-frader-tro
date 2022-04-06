// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const Theme = {
  dark: true,
  colors: {
    background: '#031329',
    surface: '#031329',
    primary: '#52D887',
    'primary-darken-1': '#2AB762',
    secondary: '#8F8AFF',
    'secondary-darken-1': '#6661D4',
    light: "#FFFFFF",
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'Theme',
    themes: {
      Theme,
    }
  }
})