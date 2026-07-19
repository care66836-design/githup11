import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ContentStudio } from './pages/ContentStudio'
import { Dashboard } from './pages/Dashboard'
import { Knowledge } from './pages/Knowledge'
import { LiveCenter } from './pages/LiveCenter'
import { ProjectDetail } from './pages/ProjectDetail'
import { Projects } from './pages/Projects'
import { Settings } from './pages/Settings'
import { Team } from './pages/Team'
import { WorkspaceProvider } from './state/WorkspaceContext'

export default function App() {
  return (
    <WorkspaceProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="content" element={<ContentStudio />} />
          <Route path="live" element={<LiveCenter />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </WorkspaceProvider>
  )
}
