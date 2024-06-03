<script lang="ts">
import { schemaRender, registerComponents } from "@oragspatl/renderer";
import { defineComponent } from "vue";

export default defineComponent({
    name: 'NodeRender',
    props: {
        schema: {
            type: Object,
            required: true
        }
    },
    setup(props: { schema: any }) {
        return () => {
            return schemaRender(props.schema)
        }
    }
})
</script>