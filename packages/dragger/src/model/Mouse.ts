import { DtdNode, getNode } from './DtdNode'
import {
  DTD_BASE_KEY,
  getClosestDtdNode,
  removeGhostElStyle,
  setMoveElStyle,
  sortMouseEvents,
  isValidNumber
} from '../common'
import { Keyboard } from './Keyboard'

export enum CursorStatus {
  Normal = 'NORMAL',
  Dragging = 'DRAGGING'
}
export enum CursorDragType {
  Grabbing = 'GRABBING',
  Move = 'MOVE',
  Copy = 'COPY',
  Resize = 'RESIZE',
  Rotate = 'ROTATE',
  Scale = 'SCALE',
  Translate = 'TRANSLATE',
  Round = 'ROUND',
  Auto = 'AUTO'
}

export enum DragEventType {
  DragStart = 'dragstart',
  Dragging = 'dragging',
  DragEnd = 'dragend',
  Select = 'select',
  Click = 'click'
}

export enum DragNodeType {
  MOVE = 'move',
  COPY = 'copy'
}

export interface ISelectNode {
  node: DtdNode
  e: MouseEvent
}

export interface ICursorPosition {
  pageX?: number

  pageY?: number

  clientX?: number

  clientY?: number

  topPageX?: number

  topPageY?: number

  topClientX?: number

  topClientY?: number
}

const DEFAULT_POSITION = {
  pageX: 0,
  pageY: 0,
  clientX: 0,
  clientY: 0,
  topPageX: 0,
  topPageY: 0,
  topClientX: 0,
  topClientY: 0
}

const setCursorStyle = (contentWindow: Window, style: string) => {
  const currentRoot = document?.getElementsByTagName?.('html')?.[0]
  const root = contentWindow?.document?.getElementsByTagName('html')?.[0]
  if (root && root.style.cursor !== style) {
    root.style.cursor = style
  }
  if (currentRoot && currentRoot.style.cursor !== style) {
    currentRoot.style.cursor = style
  }
}

export class Mouse {
  position: ICursorPosition = DEFAULT_POSITION
  dragStartPosition: ICursorPosition = DEFAULT_POSITION
  dragEndPosition: ICursorPosition = DEFAULT_POSITION
  dragStatus: CursorStatus | string = CursorStatus.Normal

  dragElement: HTMLElement | null = null

  ghostElement: HTMLElement | null = null

  podElement: HTMLElement | null = null

  dataTransfer: DtdNode[] = []

  startEvent: MouseEvent = new MouseEvent('')
  startTime: number = 0

  eventCallbacks = new Map<
    string,
    ((e: MouseEvent, targetNode?: DtdNode) => void)[]
  >()

  selectedNodes: ISelectNode[] = []

  keyboard: Keyboard | null = null

  constructor(keyboard?: Keyboard) {
    this.keyboard = keyboard || null
  }

  public setSelectedNodes(
    nodes: ISelectNode[],
    e: MouseEvent,
    targetNode?: DtdNode
  ): void {
    if (!nodes || !Array.isArray(nodes)) return
    this.selectedNodes = nodes.sort((a, b) => {
      return sortMouseEvents(a.e, b.e)
    })
    this.eventCallbacks.get(DragEventType.Select)?.forEach(cb => {
      cb(e, targetNode)
    })
  }

  public setGhostElement(ghostElement: HTMLElement | null): void {
    this.ghostElement && this.ghostElement.remove()
    this.ghostElement = ghostElement
  }

  public setPodElement(podElement: HTMLElement | null): void {
    this.podElement = podElement
  }

  public setDragStatus(status: CursorStatus | string): void {
    this.dragStatus = status
  }

  public setDragStartPosition(position: ICursorPosition): void {
    this.dragStartPosition = position
  }

  public setDragEndPosition(position: ICursorPosition): void {
    this.dragEndPosition = position
  }

  public setCursorPosition(position: ICursorPosition): void {
    this.position = position
    if (this.dragElement && this.ghostElement) {
      setMoveElStyle(this.ghostElement, position)
    }
  }

  on(
    eventType: DragEventType,
    callback: (e: MouseEvent, targetNode?: DtdNode) => void
  ) {
    if (!eventType || !callback) return
    if (this.eventCallbacks.has(eventType)) {
      if (this.eventCallbacks.get(eventType)?.includes(callback)) return
      this.eventCallbacks.get(eventType)?.push(callback)
    } else {
      this.eventCallbacks.set(eventType, [callback])
    }
  }

  off(
    eventType: DragEventType,
    callback: (e: MouseEvent, targetNode: DtdNode) => void
  ) {
    if (!eventType || !callback) return
    if (this.eventCallbacks.has(eventType)) {
      const callbacks = this.eventCallbacks.get(eventType)
      const index = callbacks?.findIndex(cb => cb === callback)
      if (isValidNumber(index) && index !== -1) {
        callbacks?.splice(index, 1)
      }
    }
  }

  isValidClick(e: MouseEvent) {
    const distance = Math.sqrt(
      Math.pow(e.pageX - this.startEvent.pageX, 2) +
        Math.pow(e.pageY - this.startEvent.pageY, 2)
    )
    const timeDelta = Date.now() - this.startTime
    return distance <= 3 && timeDelta < 300
  }

  isValidDragStart(e: MouseEvent) {
    const distance = Math.sqrt(
      Math.pow(e.pageX - this.startEvent.pageX, 2) +
        Math.pow(e.pageY - this.startEvent.pageY, 2)
    )
    const timeDelta = Date.now() - this.startTime
    return distance > 5 && e !== this.startEvent && timeDelta > 10
  }

  onDragStart(e: MouseEvent) {
    if (this.dragStatus === CursorStatus.Dragging) return
    const dragElement = getClosestDtdNode(e)
    if (!dragElement) return
    this.setDragStatus(CursorStatus.Dragging)
    this.setDragStartPosition({
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    })
    // 设置样式
    setCursorStyle(window, CursorDragType.Grabbing)
    this.dragElement = dragElement
    // 设置数据
    const dragId = dragElement?.getAttribute(DTD_BASE_KEY)
    if (dragId) {
      // 正在拖拽的node
      const node = getNode(dragId)
      if (node?.root.dragType === DragNodeType.COPY) {
        setCursorStyle(window, CursorDragType.Copy)
      }
      if (node) {
        // 如果node在选中的节点里面，携带选中的所有节点
        if (this.selectedNodes.find(item => item.node.dragId === node.dragId)) {
          this.dataTransfer = this.selectedNodes.map(item => item.node)
        } else if (!this.dataTransfer.includes(node)) {
          this.dataTransfer = [node]
        }
        this.eventCallbacks.get(DragEventType.DragStart)?.forEach(cb => {
          cb(e, node)
        })
      }
    }
  }
  onDragMove(e: MouseEvent) {
    if (this.dragStatus !== CursorStatus.Dragging) return
    e.preventDefault()
    this.setCursorPosition({
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    })

    const target = getClosestDtdNode(e) as HTMLElement
    const dragId = target?.getAttribute(DTD_BASE_KEY) as string
    const targetNode = getNode(dragId)
    this.eventCallbacks.get(DragEventType.Dragging)?.forEach(cb => {
      cb(e, targetNode)
    })
  }

  onDragEnd(e: MouseEvent) {
    // 设置样式
    setCursorStyle(window, CursorDragType.Auto)
    if (this.dragStatus !== CursorStatus.Dragging) return
    this.setDragStatus(CursorStatus.Normal)
    this.setDragEndPosition({
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    })
    // 事件
    this.eventCallbacks.get(DragEventType.DragEnd)?.forEach(cb => {
      const dragId = getClosestDtdNode(e)?.getAttribute(DTD_BASE_KEY) as string
      const targetNode = getNode(dragId)
      cb(e, targetNode)
    })
    // 移除拖拽元素
    if (this.dragElement) {
      this.dragElement = null
    }

    if (this.ghostElement) {
      removeGhostElStyle(this.ghostElement)
    }
  }

  public move = (e: MouseEvent) => {
    if (this.isValidDragStart(e)) {
      this.onDragStart(e)
      this.onDragMove(e)
    }
  }

  public down = (e: MouseEvent) => {
    this.startEvent = e
    this.startTime = Date.now()
    document.addEventListener('mousemove', this.move)
    document.addEventListener('mouseup', this.up)
  }

  public up = (e: MouseEvent) => {
    if (this.isValidClick(e)) {
      const dragId = getClosestDtdNode(e)?.getAttribute(DTD_BASE_KEY) as string
      const targetNode = getNode(dragId)
      if (targetNode && targetNode.root.dragType !== DragNodeType.COPY) {
        if (!this.keyboard?.isSelecting()) {
          this.setSelectedNodes([{ node: targetNode, e }], e)
        } else {
          // 存在的不能重复添加
          this.setSelectedNodes(
            [...this.selectedNodes, { node: targetNode, e }],
            e
          )
        }
      }
      this.eventCallbacks.get(DragEventType.Click)?.forEach(cb => {
        cb(e, targetNode)
      })
    }
    this.onDragEnd(e)
    document.removeEventListener('mousemove', this.move)
    document.removeEventListener('mouseup', this.up)
  }
}
