/* eslint-disable react-refresh/only-export-components */
import { CheckCircle2, CircleAlert } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { contentDrafts, products as demoProducts, projects as demoProjects } from '../data/demo'
import type { ContentDraft, ProductRow, ProjectSummary } from '../types'

export interface EmployeeRecord {
  name: string
  email: string
  role: string
  projects: string
  status: '正常' | '已邀请'
  tone: 'green' | 'coral' | 'gold' | 'blue'
  lastLogin: string
}

export interface KnowledgeRecord {
  title: string
  category: string
  source: string
  status: '已批准' | '待审核' | '需补证据'
  owner: string
  updated: string
}

export interface LiveSessionRecord {
  id: string
  title: string
  project: string
  platform: string
  scheduledAt: string
  status: '准备中'
}

const initialEmployees: EmployeeRecord[] = [
  { name: '周楠', email: 'admin@petip.local', role: '管理员', projects: '全部项目', status: '正常', tone: 'green', lastLogin: '今天' },
  { name: '陈序', email: 'lead@petip.local', role: '项目负责人', projects: '6 个项目', status: '正常', tone: 'green', lastLogin: '今天' },
  { name: '苏芮', email: 'consultant@petip.local', role: 'IP 顾问', projects: '4 个项目', status: '正常', tone: 'coral', lastLogin: '昨天' },
  { name: '唐可', email: 'content@petip.local', role: '内容策划', projects: '5 个项目', status: '正常', tone: 'gold', lastLogin: '昨天' },
  { name: '许哲', email: 'live@petip.local', role: '直播运营', projects: '3 个项目', status: '正常', tone: 'blue', lastLogin: '昨天' },
  { name: '林墨', email: 'linmo@petip.local', role: '只读成员', projects: '1 个项目', status: '已邀请', tone: 'blue', lastLogin: '尚未登录' },
]

const initialKnowledge: KnowledgeRecord[] = [
  { title: '宠物出行类账号：尺寸判断表达标准', category: '品类方法', source: '7 个已批准项目', status: '已批准', owner: '陈序', updated: '7 月 18 日' },
  { title: '从 AI 初稿到员工终稿：去除空泛升华', category: '内容标准', source: '32 次员工修改', status: '待审核', owner: '唐可', updated: '今天' },
  { title: '诊断式直播首轮留人结构', category: '直播方法', source: '12 场直播复盘', status: '已批准', owner: '许哲', updated: '7 月 17 日' },
  { title: '主理人 IP 强销售边界', category: '风险规则', source: '3 个退款案例', status: '需补证据', owner: '苏芮', updated: '7 月 16 日' },
]

const storageKeys = {
  projects: 'petip.addedProjects',
  completedQueue: 'petip.completedQueue',
  draftStatuses: 'petip.draftStatuses',
  employees: 'petip.addedEmployees',
  knowledge: 'petip.addedKnowledge',
  products: 'petip.addedProducts',
  liveSessions: 'petip.liveSessions',
} as const

function usePersistentState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? JSON.parse(saved) as T : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // The app remains usable when storage is unavailable.
    }
  }, [key, value])

  return [value, setValue]
}

interface WorkspaceValue {
  projects: ProjectSummary[]
  completedQueueIds: string[]
  draftStatuses: Record<string, ContentDraft['status']>
  employees: EmployeeRecord[]
  knowledge: KnowledgeRecord[]
  products: ProductRow[]
  liveSessions: LiveSessionRecord[]
  addProject: (input: Pick<ProjectSummary, 'creator' | 'pet' | 'lead' | 'platforms'> & { projectName: string }) => ProjectSummary
  completeQueueItem: (id: string) => void
  setDraftStatus: (id: string, status: ContentDraft['status']) => void
  addEmployee: (employee: Pick<EmployeeRecord, 'name' | 'email' | 'role'>) => void
  addKnowledge: (record: Pick<KnowledgeRecord, 'title' | 'category' | 'source'>) => void
  addProduct: (product: Pick<ProductRow, 'name' | 'role' | 'price' | 'margin'>) => void
  addLiveSession: (session: Pick<LiveSessionRecord, 'title' | 'project' | 'platform' | 'scheduledAt'>) => void
  notify: (message: string, tone?: 'success' | 'warning') => void
  resetLocalData: () => void
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [addedProjects, setAddedProjects] = usePersistentState<ProjectSummary[]>(storageKeys.projects, [])
  const [completedQueueIds, setCompletedQueueIds] = usePersistentState<string[]>(storageKeys.completedQueue, [])
  const [draftStatuses, setDraftStatuses] = usePersistentState<Record<string, ContentDraft['status']>>(
    storageKeys.draftStatuses,
    Object.fromEntries(contentDrafts.map((draft) => [draft.id, draft.status])),
  )
  const [addedEmployees, setAddedEmployees] = usePersistentState<EmployeeRecord[]>(storageKeys.employees, [])
  const [addedKnowledge, setAddedKnowledge] = usePersistentState<KnowledgeRecord[]>(storageKeys.knowledge, [])
  const [addedProducts, setAddedProducts] = usePersistentState<ProductRow[]>(storageKeys.products, [])
  const [liveSessions, setLiveSessions] = usePersistentState<LiveSessionRecord[]>(storageKeys.liveSessions, [])
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'warning' } | null>(null)
  const toastTimer = useRef<number | null>(null)

  const notify = useCallback((message: string, tone: 'success' | 'warning' = 'success') => {
    setToast({ message, tone })
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  const addProject: WorkspaceValue['addProject'] = useCallback((input) => {
    const sequence = demoProjects.length + addedProjects.length + 1
    const project: ProjectSummary = {
      id: `project-${Date.now()}`,
      code: `PET-2026-${String(sequence).padStart(3, '0')}`,
      name: input.projectName,
      creator: input.creator,
      pet: input.pet,
      petRole: '待定义宠物角色',
      image: '/assets/momo.jpg',
      status: '定位中',
      progress: 12,
      lead: input.lead,
      nextAction: '完善资料采集表',
      due: '待排期',
      platforms: input.platforms,
    }
    setAddedProjects((current) => [...current, project])
    return project
  }, [addedProjects.length, setAddedProjects])

  const completeQueueItem = useCallback((id: string) => {
    setCompletedQueueIds((current) => current.includes(id) ? current : [...current, id])
  }, [setCompletedQueueIds])

  const setDraftStatus = useCallback((id: string, status: ContentDraft['status']) => {
    setDraftStatuses((current) => ({ ...current, [id]: status }))
  }, [setDraftStatuses])

  const addEmployee = useCallback((employee: Pick<EmployeeRecord, 'name' | 'email' | 'role'>) => {
    setAddedEmployees((current) => [...current, {
      ...employee,
      projects: '待分配',
      status: '已邀请',
      tone: 'blue',
      lastLogin: '尚未登录',
    }])
  }, [setAddedEmployees])

  const addKnowledge = useCallback((record: Pick<KnowledgeRecord, 'title' | 'category' | 'source'>) => {
    setAddedKnowledge((current) => [{ ...record, status: '待审核', owner: '周楠', updated: '刚刚' }, ...current])
  }, [setAddedKnowledge])

  const addProduct = useCallback((product: Pick<ProductRow, 'name' | 'role' | 'price' | 'margin'>) => {
    setAddedProducts((current) => [...current, {
      ...product,
      id: `product-${Date.now()}`,
      ipFit: 70,
      liveFit: 70,
      refundRisk: '中',
      recommendation: '测试',
    }])
  }, [setAddedProducts])

  const addLiveSession = useCallback((session: Pick<LiveSessionRecord, 'title' | 'project' | 'platform' | 'scheduledAt'>) => {
    setLiveSessions((current) => [{ ...session, id: `live-${Date.now()}`, status: '准备中' }, ...current])
  }, [setLiveSessions])

  const resetLocalData = useCallback(() => {
    setAddedProjects([])
    setCompletedQueueIds([])
    setDraftStatuses(Object.fromEntries(contentDrafts.map((draft) => [draft.id, draft.status])))
    setAddedEmployees([])
    setAddedKnowledge([])
    setAddedProducts([])
    setLiveSessions([])
    notify('本地演示数据已恢复')
  }, [notify, setAddedEmployees, setAddedKnowledge, setAddedProducts, setAddedProjects, setCompletedQueueIds, setDraftStatuses, setLiveSessions])

  const value = useMemo<WorkspaceValue>(() => ({
    projects: [...demoProjects, ...addedProjects],
    completedQueueIds,
    draftStatuses,
    employees: [...initialEmployees, ...addedEmployees],
    knowledge: [...addedKnowledge, ...initialKnowledge],
    products: [...demoProducts, ...addedProducts],
    liveSessions,
    addProject,
    completeQueueItem,
    setDraftStatus,
    addEmployee,
    addKnowledge,
    addProduct,
    addLiveSession,
    notify,
    resetLocalData,
  }), [addEmployee, addKnowledge, addLiveSession, addProduct, addProject, addedEmployees, addedKnowledge, addedProducts, addedProjects, completeQueueItem, completedQueueIds, draftStatuses, liveSessions, notify, resetLocalData, setDraftStatus])

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
      {toast ? (
        <div className={`toast-message toast-${toast.tone}`} role="status">
          {toast.tone === 'success' ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
          {toast.message}
        </div>
      ) : null}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return context
}
