import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  FilePenLine,
  LayoutDashboard,
  LibraryBig,
  Menu,
  Plus,
  Radio,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { NewProjectDialog } from './NewProjectDialog'
import { useWorkspace } from '../state/WorkspaceContext'

const navigation = [
  { label: '工作台', href: '/', icon: LayoutDashboard },
  { label: '客户项目', href: '/projects', icon: BriefcaseBusiness },
  { label: '内容生产', href: '/content', icon: FilePenLine, badge: 6 },
  { label: '直播电商', href: '/live', icon: Radio, badge: 2 },
  { label: '方法知识库', href: '/knowledge', icon: LibraryBig },
  { label: '员工与权限', href: '/team', icon: Users },
]

const titleByPath: Record<string, string> = {
  '/': '工作台',
  '/projects': '客户项目',
  '/content': '内容生产',
  '/live': '直播电商',
  '/knowledge': '方法知识库',
  '/team': '员工与权限',
}

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)
  const { projects } = useWorkspace()
  const location = useLocation()
  const pageTitle = location.pathname.startsWith('/projects/')
    ? '项目详情'
    : titleByPath[location.pathname] ?? 'PetIP OS'

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []
    return projects.filter((project) => `${project.name}${project.creator}${project.pet}${project.code}`.toLowerCase().includes(query)).slice(0, 5)
  }, [projects, searchQuery])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} aria-label="主导航">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <span>P</span>
          </div>
          <div>
            <strong>PetIP OS</strong>
            <small>内部运营系统</small>
          </div>
          <button className="icon-button sidebar-close" type="button" onClick={() => setSidebarOpen(false)} aria-label="关闭导航">
            <X size={18} />
          </button>
        </div>

        <nav className="nav-list">
          <span className="nav-section-label">工作空间</span>
          {navigation.map(({ label, href, icon: Icon, badge }) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/settings" className="nav-item">
            <Settings size={19} strokeWidth={1.8} />
            <span>系统设置</span>
          </NavLink>
          <div className="current-user">
            <span className="avatar avatar-green">周</span>
            <div>
              <strong>周楠</strong>
              <small>管理员</small>
            </div>
            <ChevronLeft size={16} />
          </div>
        </div>
      </aside>

      {sidebarOpen ? <button className="sidebar-scrim" type="button" aria-label="关闭导航" onClick={() => setSidebarOpen(false)} /> : null}

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">
            <button className="icon-button menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="打开导航">
              <Menu size={20} />
            </button>
            <span>{pageTitle}</span>
          </div>
          <div className="topbar-actions">
            <div className="global-search-wrap">
              <label className="global-search">
                <Search size={17} />
                <input ref={searchInput} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="搜索项目、客户或内容" placeholder="搜索项目、客户或内容" />
                <kbd>⌘ K</kbd>
              </label>
              {searchQuery ? (
                <div className="search-results-popover">
                  {searchResults.length ? searchResults.map((project) => (
                    <Link to={`/projects/${project.id}`} key={project.id} onClick={() => setSearchQuery('')}>
                      <img src={project.image} alt="" /><span><strong>{project.name}</strong><small>{project.code} · {project.status}</small></span>
                    </Link>
                  )) : <p>没有找到匹配项目</p>}
                </div>
              ) : null}
            </div>
            <div className="notice-wrap">
              <button className="icon-button notice-button" type="button" onClick={() => setNoticeOpen((value) => !value)} aria-label="查看通知">
                <Bell size={19} />
                <span />
              </button>
              {noticeOpen ? (
                <div className="notice-popover">
                  <div className="popover-title"><strong>待办提醒</strong><span>4 项</span></div>
                  <Link to="/projects/momo" onClick={() => setNoticeOpen(false)}>定位报告等待批准</Link>
                  <Link to="/live" onClick={() => setNoticeOpen(false)}>明日直播脚本尚未锁定</Link>
                </div>
              ) : null}
            </div>
            <button className="button button-primary top-create" type="button" onClick={() => setNewProjectOpen(true)}>
              <Plus size={17} />
              新建项目
            </button>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <NewProjectDialog open={newProjectOpen} onClose={() => setNewProjectOpen(false)} />
    </div>
  )
}
