import { DtdNode } from "@oragspatl/dragger-vue";
import { registeredComponents } from "@oragspatl/renderer";
import { Component, VNode, h } from "vue";

type DNodeType = string | DNode | DNode[] | Record<string, DNode[]>;

interface DNode {
    id: string;
    componentName: string | Component;
    props: Record<string, any>;
    children: DNodeType;
}

function getPlaceholderNode(node: DtdNode): DNode {
    return {
        id: node.componentId,
        componentName: node.componentName,
        props: {
            ...node.props,
            style: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                height: '100%',
                width: '100%',
                minHeight: '20px',
            }
        },
        children: 'Drop here'
    }
}

export function dtdNodeToDNode(node: DtdNode): DNode {
    if (node.placeholder) {
        return getPlaceholderNode(node)
    }
    // TODO slots
    return {
        id: node.componentId,
        componentName: registeredComponents.get(node.componentName) || node.componentName,
        props: node.props,
        children: dtdNodesToDNodes(node.children)
    }
}

export function dtdNodesToDNodes(nodes: DtdNode[]): DNodeType {
    return nodes.map(node => dtdNodeToDNode(node))
}

export function dNodeToVNode(node: DNode): VNode {
    return h(
        node.componentName,
        {
            ...node.props,
            key: node.id
        },
        dNodesToVNodes(node.children)
    )
}

function dNodesToVNodes(nodes: DNodeType): VNode[] | string | Record<string, VNode[]> {
    if (typeof nodes === 'string') return nodes
    if (Array.isArray(nodes)) {
        return nodes.map(node => dNodeToVNode(node))
    } else if (typeof nodes === 'object') {
        const slots = Reflect.ownKeys(nodes)
        if (slots.length) {
            slots.forEach(slot => {
                nodes[slot] = () => dNodesToVNodes(nodes[slot])
            })
            return nodes
        } else return []
    } else return []
}

export function renderDtdNode(node: DtdNode): VNode {
    return dNodeToVNode(dtdNodeToDNode(node))
}

export function renderDtdNodes(nodes: DtdNode[]) {
    // 是否是插槽选项
    const slotGroup = nodes.reduce((group, node) => {
        if (node.slotName) {
            if (!group[node.slotName]) {
                group[node.slotName] = []
            }
            group[node.slotName].push(node)
        }
        return group
    }, {} as Record<string, DtdNode[]>)
    console.log("slotGroup", slotGroup)
    const slotNames = Object.keys(slotGroup)
    const slots = {}
    if (slotNames.length) {
        slotNames.map(slotName => {
            slots[slotName] = () => slotGroup[slotName].map(node => renderDtdNode(node))
        })
        return slots
    } else {
        return nodes.map(node => renderDtdNode(node))
    }
}