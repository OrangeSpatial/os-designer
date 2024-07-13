<script lang="ts">
import { schemaRender } from "@oragspatl/renderer";
import { defineComponent, h } from "vue";
import { dtdNodesToDNodes, renderDtdNode, renderDtdNodes } from "./render";

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
            console.log('NodeRender', props.schema)
            return renderDtdNodes(props.schema.children)
        }
    }
})
</script>