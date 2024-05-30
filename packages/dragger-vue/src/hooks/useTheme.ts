import { shallowRef } from 'vue'
// 引入主题
import light from '../theme/light'
import night from '../theme/night'

// 定义在全局的样式变量
const theme = shallowRef({})

export function useTheme() {
  // 尝试从本地读取
  const localTheme = localStorage.getItem('theme')
  theme.value = localTheme ? JSON.parse(localTheme) : light

  const setDayTheme = () => {
    theme.value = light
  }

  const setDarkTheme = () => {
    theme.value = night
  }

  return {
    theme,
    setDayTheme,
    setDarkTheme
  }
}
