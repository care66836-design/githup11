# PetIP 账号助手

PetIP 是一个精简的宠物账号定位与文案工作台。用户提供账号、人物、宠物、人宠关系、内容数据和真实表达样本后，系统会联网核对公开信息，生成一个主定位和 7 天测试计划；后续文案会继承该定位与表达风格。

## 核心流程

1. 填写账号资料并粘贴公开主页链接。
2. AI 通过 OpenAI Responses API 和 `web_search` 核对公开信息。
3. 输出主定位、主页包装、7 天内容测试、商业方向、证据和资料缺口。
4. 使用已确认的定位生成原生口播、IP 观点、日常记录或电商转化文案。

## 本地启动

需要 Node.js 20+ 和一个 OpenAI API key。

```bash
cp .env.example .env
```

在 `.env` 中配置：

```dotenv
OPENAI_API_KEY="你的 OpenAI API key"
OPENAI_MODEL="gpt-5.6"
```

然后运行：

```bash
pnpm install
pnpm dev
```

前端默认运行在 `http://127.0.0.1:5173`，API 默认运行在 `http://127.0.0.1:8787`。API key 只保存在服务端环境变量中，不会发送到浏览器或写入本地历史。

## 验证

```bash
pnpm check
```
