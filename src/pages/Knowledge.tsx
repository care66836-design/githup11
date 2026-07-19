import { BookOpenCheck, FileSearch, Filter, Search, Sparkles } from 'lucide-react'
import { StatusChip } from '../components/ui'

const knowledgeItems = [
  { title: '宠物出行类账号：尺寸判断表达标准', category: '品类方法', source: '7 个已批准项目', status: '已批准', owner: '陈序', updated: '7 月 18 日' },
  { title: '从 AI 初稿到员工终稿：去除空泛升华', category: '内容标准', source: '32 次员工修改', status: '待审核', owner: '唐可', updated: '今天' },
  { title: '诊断式直播首轮留人结构', category: '直播方法', source: '12 场直播复盘', status: '已批准', owner: '许哲', updated: '7 月 17 日' },
  { title: '主理人 IP 强销售边界', category: '风险规则', source: '3 个退款案例', status: '需补证据', owner: '苏芮', updated: '7 月 16 日' },
]

export function Knowledge() {
  return <div className="page-stack"><section className="page-heading compact-heading"><div><p className="eyebrow">经审核的方法沉淀</p><h1>方法知识库</h1><p>员工终稿、成功案例和失败复盘先进入审核，再影响生成规则。</p></div><button className="button button-primary" type="button"><Sparkles size={16} /> 新建知识候选</button></section><section className="knowledge-stats"><div><BookOpenCheck size={20} /><span><strong>48</strong>已批准方法</span></div><div><FileSearch size={20} /><span><strong>7</strong>待审核候选</span></div><div><Sparkles size={20} /><span><strong>32</strong>本月编辑差异</span></div></section><section className="toolbar-row"><label className="table-search"><Search size={17} /><input aria-label="搜索知识" placeholder="搜索方法、品类或来源" /></label><button className="button button-secondary" type="button"><Filter size={16} /> 筛选</button></section><section className="panel"><div className="data-table knowledge-table"><div className="table-row table-head"><span>知识条目</span><span>分类</span><span>证据来源</span><span>状态</span><span>负责人</span><span>更新</span></div>{knowledgeItems.map((item) => <div className="table-row" key={item.title}><strong>{item.title}</strong><span>{item.category}</span><span>{item.source}</span><span><StatusChip tone={item.status === '已批准' ? 'green' : item.status === '待审核' ? 'gold' : 'coral'}>{item.status}</StatusChip></span><span>{item.owner}</span><span>{item.updated}</span></div>)}</div></section><section className="knowledge-policy-note"><BookOpenCheck size={20} /><div><strong>不会自动学习所有员工修改</strong><p>编辑差异先脱敏、归类并由知识审核员确认适用范围，避免客户语言跨项目泄露。</p></div></section></div>
}

