# Simple Translate for VS Code

Simple Translate 已从 Chrome 插件改造为 VS Code 插件。它保留原插件的核心能力：划词翻译、多翻译引擎、快捷键、右键菜单、语言自动检测、缓存、限流、API Key 配置和手动输入翻译。

## 安装

从 GitHub Release 下载 [`simple-translate-vscode-1.0.6.vsix`](https://github.com/Sunk011/simple-translate-vscode/releases/download/v1.0.6/simple-translate-vscode-1.0.6.vsix) 后安装：

```powershell
code --install-extension simple-translate-vscode-1.0.6.vsix
```

也可以在 VS Code 扩展面板右上角选择 `Install from VSIX...`，然后选择下载的 `.vsix` 文件。

## 功能

- 启动后自动激活，默认 `auto` 模式下选中文本即翻译。
- 默认 `Alt+T` 翻译当前选区，也支持用户在 VS Code Keyboard Shortcuts 中自定义。
- 编辑器右键菜单支持“翻译选中文本”和“翻译并替换选中文本”。
- 支持 Google 免费、Bing、DeepL 免费、DeepL API、OpenAI 兼容 AI 翻译、Google Cloud Translation。
- 自动在主要语言 A/B 之间互译，默认中文/英文。
- 译文默认显示在可拖动的翻译面板中，不会插入虚拟行或挤压代码布局；也可改为 hover、通知或仅状态栏显示。
- 付费/API 引擎的 API Key 可通过命令保存到 VS Code SecretStorage。

## 调试运行

1. 用 VS Code 打开当前目录。
2. 按 `F5` 启动 Extension Development Host。
3. 在新窗口中打开任意文本文件。
4. 用鼠标选中文本，默认会直接翻译并在选区末尾显示译文。
5. 也可以在选区上右键选择 `Simple Translate` 命令，或运行 `Simple Translate: 配置翻译快捷键` 绑定自己的快捷键。

## 常用命令

- `Simple Translate: 翻译选中文本`
- `Simple Translate: 翻译并替换选中文本`
- `Simple Translate: 输入文本翻译`
- `Simple Translate: 选择翻译引擎`
- `Simple Translate: 设置当前引擎 API Key`
- `Simple Translate: 测试翻译引擎`
- `Simple Translate: 配置翻译快捷键`
- `Simple Translate: 显示翻译面板`
- `Simple Translate: 开启/关闭划词翻译`
- `Simple Translate: 清除翻译显示`

## 快捷键自定义

本扩展默认绑定 `Alt+T` 翻译当前选区。你可以运行命令：

```text
Simple Translate: 配置翻译快捷键
```

然后在 VS Code 的快捷键编辑器里为以下命令绑定任意按键：

- `simpleTranslate.translateSelection`: 翻译选中文本。
- `simpleTranslate.translateAndReplace`: 翻译并替换选中文本。
- `simpleTranslate.translateInput`: 输入文本翻译。

也可以直接编辑 VS Code 的 `keybindings.json`，例如：

```json
[
  {
    "key": "ctrl+alt+t",
    "command": "simpleTranslate.translateSelection",
    "when": "editorTextFocus && editorHasSelection"
  }
]
```

Settings 页面中也提供了 `simpleTranslate.shortcut` 项，默认值为 `alt+t`。由于 VS Code 快捷键必须由 Keyboard Shortcuts 系统管理，修改实际快捷键时仍需要通过上面的命令或 `keybindings.json` 完成绑定。

### Chrome 插件版快捷键

如果你安装的是上游 Chrome 插件版，快捷键由 Chrome 浏览器统一管理。打开：

```text
chrome://extensions/shortcuts
```

找到 `Simple Translate`，然后为“翻译选中文本”设置你想使用的快捷键即可。Chrome 版默认建议快捷键是 `Alt+T`，但可以在这个页面里替换成其他按键。

## 关键设置

```json
{
  "simpleTranslate.enabled": true,
  "simpleTranslate.provider": "bing",
  "simpleTranslate.triggerMode": "auto",
  "simpleTranslate.displayMode": "panel",
  "simpleTranslate.primaryLangA": "zh",
  "simpleTranslate.primaryLangB": "en",
  "simpleTranslate.aiBaseUrl": "https://api.openai.com",
  "simpleTranslate.aiModel": "gpt-4o-mini",
  "simpleTranslate.shortcut": "alt+t",
  "simpleTranslate.minChars": 2,
  "simpleTranslate.maxChars": 500
}
```

`triggerMode` 支持：

- `auto`: 选中文本后自动翻译。
- `icon`: 选中文本后在状态栏显示“翻译选区”按钮。
- `manual`: 仅通过右键菜单、命令面板或用户自定义快捷键翻译。

`displayMode` 支持：

- `panel`: 显示可拖动的 Webview 翻译面板。
- `hover`: 以 VS Code 悬浮提示显示译文，不影响代码布局。
- `inline`: 兼容旧配置，实际使用悬浮提示显示译文。
- `notification`: 用 VS Code 通知显示译文。
- `both`: 同时使用悬浮提示和通知。
- `statusBar`: 仅状态栏显示。

翻译面板说明：

- 默认 `panel` 模式会打开 `Simple Translate` Webview 面板。
- 面板里的翻译卡片可以拖动，位置会在该面板内保持。
- 你也可以拖动 VS Code 的面板标签页，把它放到右侧、底部或其他编辑器组。

悬浮提示说明：

- 自动划词翻译完成后，扩展会轻微高亮选区并自动打开 VS Code hover 弹窗显示译文。
- VS Code 原生 hover 本身不支持扩展改成可拖动。如果需要拖动，请使用默认的 `panel` 模式。
- 完整译文也会同步到状态栏 tooltip 和输出面板。

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

本项目基于上游 Chrome 插件 [`rankangkang/simple-translate-extension`](https://github.com/rankangkang/simple-translate-extension) 改造为 VS Code 插件。当前工作目录中保留了原 Chrome 插件包的构建产物与清单文件，包括 `manifest.json`、`service-worker-loader.js`、`assets/`、`src/popup/` 和 `src/options/`。

本地改造所用插件包目录为：`simple-translate-v0.1.0`。
