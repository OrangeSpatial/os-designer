import { DtdNode, deleteNode, getNode } from './DtdNode'
import {
  getClosestDtdNode,
  removeGhostElStyle,
  setMoveElStyle,
  sortMouseEvents,
  isValidNumber,
  DTD_BASE_KEY
} from '../common'
import { Keyboard } from './Keyboard'

export enum CursorStatus {
  Normal = 'NORMAL',
  Dragging = 'DRAGGING',
  Resizing = 'RESIZING'
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

export enum MouseEventType {
  DragStart = 'dragstart',
  Dragging = 'dragging',
  DragEnd = 'dragend',
  Select = 'select',

  Click = 'click',
  Move = 'move',
  Down = 'down',
  Up = 'up'
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
  dragStatus: CursorStatus = CursorStatus.Normal

  dragElement: HTMLElement | null = null

  ghostElement: HTMLElement | null = null

  podElement: HTMLElement | null = null

  dataTransfer: DtdNode[] = []

  startEvent: MouseEvent | null = null
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
    this.eventCallbacks.get(MouseEventType.Select)?.forEach(cb => {
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

  public setDragStatus(status: CursorStatus): void {
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
    eventType: MouseEventType,
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
    eventType: MouseEventType,
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
    if (!this.startEvent) return false
    const distance = Math.sqrt(
      Math.pow(e.pageX - this.startEvent.pageX, 2) +
        Math.pow(e.pageY - this.startEvent.pageY, 2)
    )
    const timeDelta = Date.now() - this.startTime
    return distance <= 3 && timeDelta < 300
  }

  isWillDrag(e: MouseEvent) {
    const dragElement = getClosestDtdNode(e)
    return !!dragElement?.getAttribute(DTD_BASE_KEY)
  }

  isValidDragStart(e: MouseEvent) {
    if (
      !this.startEvent ||
      this.startEvent.button === 2 ||
      ![CursorStatus.Normal, CursorStatus.Dragging].includes(this.dragStatus)
    )
      return false
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
    this.dragElement = dragElement
    // 设置数据
    const dragId = dragElement?.getAttribute(DTD_BASE_KEY)
    if (!dragId) return
    // 正在拖拽的node
    const node = getNode(dragId)
    if (!node || !node.parent) return
    this.setDragStatus(CursorStatus.Dragging)
    this.setDragStartPosition({
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    })
    // 设置样式
    setCursorStyle(window, CursorDragType.Grabbing)
    if (node?.root.dragType === DragNodeType.COPY) {
      setCursorStyle(window, CursorDragType.Copy)
    }
    if (node) {
      // 如果node在选中的节点里面，携带选中的所有节点
      if (this.selectedNodes.find(item => item.node.dragId === node.dragId)) {
        this.dataTransfer = this.selectedNodes.map(item => item.node)
      } else if (!this.dataTransfer.includes(node)) {
        this.dataTransfer = [node]
        this.setSelectedNodes([], e)
      }
      this.eventCallbacks.get(MouseEventType.DragStart)?.forEach(cb => {
        cb(e, node)
      })
    }
  }

  onDragMove(e: MouseEvent) {
    if (this.dragStatus !== CursorStatus.Dragging) return
    this.setCursorPosition({
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    })

    const target = getClosestDtdNode(e) as HTMLElement
    const dragId = target?.getAttribute(DTD_BASE_KEY) as string
    const targetNode = getNode(dragId)
    this.eventCallbacks.get(MouseEventType.Dragging)?.forEach(cb => {
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
    this.eventCallbacks.get(MouseEventType.DragEnd)?.forEach(cb => {
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
    this.eventCallbacks.get(MouseEventType.Move)?.forEach(cb => {
      cb(e)
    })
  }

  public down = (e: MouseEvent) => {
    this.eventCallbacks.get(MouseEventType.Down)?.forEach(cb => {
      cb(e)
    })
    if (this.isWillDrag(e)) {
      this.startEvent = e
      this.startTime = Date.now()
      e.preventDefault()
    }
    window.addEventListener('mouseup', this.up)
  }

  public up = (e: MouseEvent) => {
    if (this.isValidClick(e)) {
      const dragId = getClosestDtdNode(e)?.getAttribute(DTD_BASE_KEY) as string
      const targetNode = getNode(dragId)
      if (
        targetNode &&
        targetNode.parent &&
        targetNode.root.dragType !== DragNodeType.COPY
      ) {
        if (e.ctrlKey || e.metaKey) {
          // 存在的不能重复添加, 已添加的取消选中
          const index = this.selectedNodes.findIndex(
            item => item.node.dragId === targetNode.dragId
          )
          if (index !== -1) {
            this.selectedNodes.splice(index, 1)
          } else {
            this.selectedNodes.push({ node: targetNode, e })
          }
        } else {
          this.setSelectedNodes([{ node: targetNode, e }], e)
        }
      }
      this.eventCallbacks.get(MouseEventType.Click)?.forEach(cb => {
        cb(e, targetNode)
      })
    }
    this.startEvent = null
    this.onDragEnd(e)
    this.eventCallbacks.get(MouseEventType.Up)?.forEach(cb => {
      cb(e)
    })
    window.removeEventListener('mouseup', this.up)
  }

  /**
   * 插入到指定位置
   * @param targetNode 被插入节点
   * @param sourceNodes 待插入节点
   * @param insertBefore
   * @param type
   * @param isContainer 目标节点是否是容器
   */
  insertNode(
    targetNode: DtdNode,
    sourceNodes: DtdNode[],
    insertBefore: boolean,
    type: DragNodeType,
    isContainer: boolean
  ) {
    if (!targetNode || !sourceNodes) return
    if (type === DragNodeType.MOVE) {
      // 删除原节点
      deleteNode(sourceNodes)
    }
    const parent = isContainer ? targetNode : targetNode.parent || targetNode
    const insertNodes = sourceNodes.map(node => {
      node.parent = parent
      // 如果是copy
      if (type === DragNodeType.COPY) {
        node = new DtdNode({ ...node, dragId: '' }, parent)
      }
      return node
    })
    // update dataTransfer
    if (type === DragNodeType.COPY) {
      this.dataTransfer = insertNodes
    }
    if (isContainer) {
      insertBefore
        ? targetNode.children.unshift(...insertNodes)
        : targetNode.children.push(...insertNodes)
    } else {
      parent.children.splice(
        parent.children.findIndex(node => targetNode.dragId === node.dragId) +
          (insertBefore ? 0 : 1),
        0,
        ...insertNodes
      )
    }
  }

  deleteSelectedNodes() {
    this.selectedNodes.forEach(item => {
      deleteNode(item.node)
    })
    this.selectedNodes = []
  }
}
