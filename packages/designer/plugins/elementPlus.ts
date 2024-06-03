import { ElButton, ElCheckbox, ElInput, ElRadio, ElSelect } from 'element-plus'
import { App } from 'vue'

export const elComponents = {
  ElButton,
  ElInput,
  ElSelect,
  ElRadio,
  ElCheckbox
}

export default (app: App) => {
  Object.keys(elComponents).forEach(key => {
    app.use(elComponents[key])
  })
}
