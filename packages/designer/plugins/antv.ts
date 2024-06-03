import { App } from 'vue'
import { Button, Input, Select, Radio, Checkbox } from 'ant-design-vue'

export const antvComponents = {
  Button,
  Input,
  Select,
  Radio,
  Checkbox
}

export default (app: App) => {
  Object.keys(antvComponents).forEach(key => {
    console.log('installing', antvComponents[key])
    app.use(antvComponents[key])
  })
}
