import { DtdNode } from "@oragspatl/dragger-vue";

export interface ISelectNode {
  node: DtdNode
  e: MouseEvent
}

export interface vNode {
  id: string;
  componentName: string;
  props: Record<string, any>;
  children: vNode[] | Record<string, vNode[]> | string;
}