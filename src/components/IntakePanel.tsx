import { Globe2, ImagePlus, LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import type { AccountIntake, ServiceHealth } from '../assistant/types'

type IntakePanelProps = {
  intake: AccountIntake
  health: ServiceHealth | null
  loading: boolean
  error: string
  onChange: (next: AccountIntake) => void
  onSubmit: () => void
}

const exampleIntake: AccountIntake = {
  platform: '抖音',
  accountName: '林晚和 Momo',
  profileUrl: '',
  creatorProfile: '我是一名宠物用品品牌主理人，平时说话比较直接，会露脸，也愿意分享做产品时踩过的坑。每周可以拍 3 到 4 条。',
  petProfile: 'Momo，3 岁边牧，外形干净，出门时很兴奋，坐车很安静，会主动把牵引绳叼到门口。',
  relationship: '我负责做出行计划，Momo 总会用自己的方式打乱计划。我们的真实关系更像一起通勤和旅行的搭档。',
  contentStatus: '目前主要发日常记录，近 30 天发布 12 条，最好的一条是带 Momo 第一次坐高铁。没有稳定栏目。',
  goal: '先把账号定位做清楚，三个月后能自然承接宠物出行用品和车载用品。',
  voiceSamples: '“这个东西我自己不会用第二次。”\n“带狗出门，麻烦的从来不是狗。”\n“先别买，我把最容易踩的坑说完。”',
  constraints: '不演夸张剧情，不把 Momo 的动机编成故事，不用焦虑式标题。',
  images: [],
}

export function IntakePanel({ intake, health, loading, error, onChange, onSubmit }: IntakePanelProps) {
  const setField = <K extends keyof AccountIntake>(key: K, value: AccountIntake[K]) => {
    onChange({ ...intake, [key]: value })
  }

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith('image/') && file.size <= 4 * 1024 * 1024)
      .slice(0, Math.max(0, 3 - intake.images.length))
    Promise.all(files.map((file) => new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
      reader.readAsDataURL(file)
    }))).then((images) => setField('images', [...intake.images, ...images.filter(Boolean)].slice(0, 3)))
    event.target.value = ''
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="intake-panel" onSubmit={submit}>
      <div className="panel-heading">
        <div>
          <span className="step-label">01 · 提供资料</span>
          <h1>这个账号是什么样？</h1>
        </div>
        <button className="text-button" type="button" onClick={() => onChange(exampleIntake)}>
          <RotateCcw size={14} /> 填入示例
        </button>
      </div>

      <div className="field-row field-row-platform">
        <label>
          <span>平台</span>
          <select value={intake.platform} onChange={(event) => setField('platform', event.target.value as AccountIntake['platform'])}>
            <option>抖音</option>
            <option>小红书</option>
            <option>视频号</option>
            <option>B站</option>
            <option>快手</option>
            <option>其他</option>
          </select>
        </label>
        <label>
          <span>账号名</span>
          <input value={intake.accountName} onChange={(event) => setField('accountName', event.target.value)} placeholder="例如：林晚和 Momo" />
        </label>
      </div>

      <label className="field-block">
        <span>主页链接</span>
        <div className="input-with-icon">
          <Globe2 size={16} />
          <input type="url" value={intake.profileUrl} onChange={(event) => setField('profileUrl', event.target.value)} placeholder="粘贴公开主页链接，AI 会联网查看" />
        </div>
      </label>

      <label className="field-block">
        <span>你是谁</span>
        <textarea required value={intake.creatorProfile} onChange={(event) => setField('creatorProfile', event.target.value)} placeholder="身份、经历、性格、擅长什么、是否愿意露脸、每周能拍多少内容" rows={4} />
      </label>

      <label className="field-block">
        <span>宠物是什么样</span>
        <textarea required value={intake.petProfile} onChange={(event) => setField('petProfile', event.target.value)} placeholder="品种、年龄、外形、真实行为、特殊经历、适合出现的场景" rows={4} />
      </label>

      <label className="field-block">
        <span>你们的关系</span>
        <textarea required value={intake.relationship} onChange={(event) => setField('relationship', event.target.value)} placeholder="你和宠物平时如何相处，有哪些持续发生的真实故事" rows={3} />
      </label>

      <label className="field-block">
        <span>现在发什么、数据怎样</span>
        <textarea value={intake.contentStatus} onChange={(event) => setField('contentStatus', event.target.value)} placeholder="内容类型、更新频率、粉丝量、近 30 天表现、最好和最差的作品" rows={3} />
      </label>

      <label className="field-block">
        <span>你想做到什么</span>
        <textarea required value={intake.goal} onChange={(event) => setField('goal', event.target.value)} placeholder="希望吸引谁、做成什么账号、未来想接什么商业方向" rows={3} />
      </label>

      <label className="field-block">
        <span>真实说话样本</span>
        <textarea value={intake.voiceSamples} onChange={(event) => setField('voiceSamples', event.target.value)} placeholder="粘贴 3 到 10 句你真实说过的话，每句一行" rows={4} />
      </label>

      <label className="field-block">
        <span>不想做的内容</span>
        <input value={intake.constraints} onChange={(event) => setField('constraints', event.target.value)} placeholder="例如：不演剧情、不露脸、不强行卖货" />
      </label>

      <div className="upload-block">
        <div>
          <strong>照片或主页截图</strong>
          <span>最多 3 张，单张不超过 4MB</span>
        </div>
        <label className="upload-button">
          <ImagePlus size={16} /> 添加图片
          <input className="visually-hidden" type="file" accept="image/*" multiple onChange={handleFiles} />
        </label>
      </div>

      {intake.images.length > 0 && (
        <div className="image-preview-list">
          {intake.images.map((image, index) => (
            <div className="image-preview" key={`${image.slice(0, 24)}-${index}`}>
              <img src={image} alt={`已添加资料 ${index + 1}`} />
              <button type="button" aria-label={`移除第 ${index + 1} 张图片`} onClick={() => setField('images', intake.images.filter((_, itemIndex) => itemIndex !== index))}>
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {health && !health.configured && (
        <div className="connection-note" role="note">
          <strong>AI 尚未连接</strong>
          <span>在项目的 .env 中加入 OPENAI_API_KEY，重启服务后即可联网分析。</span>
        </div>
      )}

      {error && <div className="form-error" role="alert">{error}</div>}

      <button className="primary-action" type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
        {loading ? '正在查找公开资料并分析…' : '联网生成账号定位'}
      </button>
    </form>
  )
}
