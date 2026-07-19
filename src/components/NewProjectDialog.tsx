import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from './ui'
import { useWorkspace } from '../state/WorkspaceContext'

export function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { addProject, notify } = useWorkspace()
  const [projectName, setProjectName] = useState('')
  const [creator, setCreator] = useState('')
  const [pet, setPet] = useState('')
  const [lead, setLead] = useState('陈序')
  const [platform, setPlatform] = useState('抖音')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const project = addProject({ projectName, creator, pet, lead, platforms: [platform] })
    notify(`项目 ${project.name} 已创建`)
    setProjectName('')
    setCreator('')
    setPet('')
    onClose()
    navigate(`/projects/${project.id}`)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="新建客户项目"
      description="创建后先进入资料采集和定位诊断阶段。"
    >
      <form className="operation-form" id="new-project-form" onSubmit={submit}>
        <label><span>项目名称</span><input required value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="例如：林晚 × Momo 品牌主理人 IP" /></label>
        <div className="form-grid">
          <label><span>创作者</span><input required value={creator} onChange={(event) => setCreator(event.target.value)} placeholder="姓名" /></label>
          <label><span>宠物</span><input required value={pet} onChange={(event) => setPet(event.target.value)} placeholder="宠物名" /></label>
        </div>
        <div className="form-grid">
          <label><span>负责人</span><select value={lead} onChange={(event) => setLead(event.target.value)}><option>陈序</option><option>苏芮</option><option>周楠</option></select></label>
          <label><span>首发平台</span><select value={platform} onChange={(event) => setPlatform(event.target.value)}><option>抖音</option><option>小红书</option><option>视频号</option></select></label>
        </div>
        <div className="form-actions"><button className="button button-secondary" type="button" onClick={onClose}>取消</button><button className="button button-primary" type="submit">创建项目</button></div>
      </form>
    </Modal>
  )
}
