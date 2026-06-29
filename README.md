# Simple Translate for VS Code

Simple Translate 已从 Chrome 插件改造为 VS Code 插件。它保留原插件的核心能力：划词翻译、多翻译引擎、快捷键、右键菜单、语言自动检测、缓存、限流、API Key 配置和手动输入翻译。

## 安装

从 GitHub Release 下载 `simple-translate-vscode-1.0.0.vsix` 后安装：

```powershell
code --install-extension simple-translate-vscode-1.0.0.vsix
```

也可以在 VS Code 扩展面板右上角选择 `Install from VSIX...`，然后选择下载的 `.vsix` 文件。

## 功能

- 启动后自动激活，默认 `auto` 模式下选中文本即翻译。
- `Alt+T` 翻译当前选区。
- 编辑器右键菜单支持“翻译选中文本”和“翻译并替换选中文本”。
- 支持 Google 免费、Bing、DeepL 免费、DeepL API、OpenAI 兼容 AI 翻译、Google Cloud Translation。
- 自动在主要语言 A/B 之间互译，默认中文/英文。
- 译文可显示为编辑器内联装饰、通知、二者同时显示，或仅状态栏显示。
- 付费/API 引擎的 API Key 可通过命令保存到 VS Code SecretStorage。

## 调试运行

1. 用 VS Code 打开当前目录。
2. 按 `F5` 启动 Extension Development Host。
3. 在新窗口中打开任意文本文件。
4. 用鼠标选中文本，默认会直接翻译并在选区末尾显示译文。
5. 也可以按 `Alt+T`，或在选区上右键选择 `Simple Translate` 命令。

## 常用命令

- `Simple Translate: 翻译选中文本`
- `Simple Translate: 翻译并替换选中文本`
- `Simple Translate: 输入文本翻译`
- `Simple Translate: 选择翻译引擎`
- `Simple Translate: 设置当前引擎 API Key`
- `Simple Translate: 测试翻译引擎`
- `Simple Translate: 开启/关闭划词翻译`
- `Simple Translate: 清除翻译显示`

## 关键设置

```json
{
  "simpleTranslate.enabled": true,
  "simpleTranslate.provider": "bing",
  "simpleTranslate.triggerMode": "auto",
  "simpleTranslate.displayMode": "inline",
  "simpleTranslate.primaryLangA": "zh",
  "simpleTranslate.primaryLangB": "en",
  "simpleTranslate.aiBaseUrl": "https://api.openai.com",
  "simpleTranslate.aiModel": "gpt-4o-mini",
  "simpleTranslate.minChars": 2,
  "simpleTranslate.maxChars": 500
}
```

`triggerMode` 支持：

- `auto`: 选中文本后自动翻译。
- `icon`: 选中文本后在状态栏显示“翻译选区”按钮。
- `manual`: 仅通过右键菜单、命令面板或 `Alt+T` 翻译。

`displayMode` 支持：

- `inline`: 在选区末尾显示译文。
- `notification`: 用 VS Code 通知显示译文。
- `both`: 同时使用内联和通知。
- `statusBar`: 仅状态栏显示。

## API Key

需要 Key 的引擎包括 `deepl`、`ai`、`google`。推荐使用命令：

```text
Simple Translate: 设置当前引擎 API Key
```

也兼容 settings JSON：

```json
{
  "simpleTranslate.apiKeys": {
    "ai": "sk-...",
    "deepl": "...",
    "google": "..."
  }
}
```

## 与 Chrome 版的差异

Chrome 版可以向网页注入字幕浮层；VS Code 扩展不能任意覆盖编辑器 UI，因此这里使用 VS Code 原生的内联装饰、状态栏按钮和通知来承载同样的翻译结果与交互。

## 原仓库来源

本项目基于 `Simple Translate` Chrome 插件包改造为 VS Code 插件。当前工作目录中保留了原 Chrome 插件的构建产物与清单文件，包括 `manifest.json`、`service-worker-loader.js`、`assets/`、`src/popup/` 和 `src/options/`。

原始插件包未随附 Git 远程地址、`repository` 字段或可识别的上游 GitHub URL，因此这里按本地来源标注为：`simple-translate-v0.1.0` Chrome 插件包。
