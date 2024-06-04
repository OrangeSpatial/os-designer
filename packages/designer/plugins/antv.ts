import { App } from 'vue'
import { Button, Input, Select, Radio, Checkbox, Card, Collapse } from 'ant-design-vue'

export const antvComponents = {
  Button,
  Input,
  Select,
  Radio,
  Checkbox,
  Card,
  Collapse
}

export default (app: App) => {
  Object.keys(antvComponents).forEach(key => {
    app.use(antvComponents[key])
  })
}
