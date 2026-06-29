const vscode = require("vscode");

const LANGUAGES = [
  { code: "zh", name: "中文", nameEn: "Chinese", script: "cjk" },
  { code: "en", name: "English", nameEn: "English", script: "latin" },
  { code: "ja", name: "日本語", nameEn: "Japanese", script: "kana" },
  { code: "ko", name: "한국어", nameEn: "Korean", script: "hangul" },
  { code: "fr", name: "Français", nameEn: "French", script: "latin" },
  { code: "de", name: "Deutsch", nameEn: "German", script: "latin" },
  { code: "es", name: "Español", nameEn: "Spanish", script: "latin" },
  { code: "pt", name: "Português", nameEn: "Portuguese", script: "latin" },
  { code: "ru", name: "Русский", nameEn: "Russian", script: "cyrillic" },
  { code: "ar", name: "العربية", nameEn: "Arabic", script: "arabic" },
  { code: "it", name: "Italiano", nameEn: "Italian", script: "latin" },
  { code: "th", name: "ไทย", nameEn: "Thai", script: "thai" },
  { code: "vi", name: "Tiếng Việt", nameEn: "Vietnamese", script: "latin" }
];

const LANGUAGE_BY_CODE = Object.fromEntries(LANGUAGES.map((language) => [language.code, language]));
const LANGUAGE_CODES = LANGUAGES.map((language) => language.code);

const GOOGLE_LANGUAGE_MAP = {
  zh: "zh-CN",
  en: "en",
  ja: "ja",
  ko: "ko",
  fr: "fr",
  de: "de",
  es: "es",
  pt: "pt",
  ru: "ru",
  ar: "ar",
  it: "it",
  th: "th",
  vi: "vi"
};

const BING_LANGUAGE_MAP = {
  zh: "zh-Hans",
  en: "en",
  ja: "ja",
  ko: "ko",
  fr: "fr",
  de: "de",
  es: "es",
  pt: "pt",
  ru: "ru",
  ar: "ar",
  it: "it",
  th: "th",
  vi: "vi"
};

const DEEPL_LANGUAGE_MAP = {
  zh: "ZH",
  en: "EN",
  ja: "JA",
  ko: "KO",
  fr: "FR",
  de: "DE",
  es: "ES",
  pt: "PT",
  ru: "RU",
  ar: "AR",
  it: "IT",
  th: "TH",
  vi: "VI"
};

const AI_LANGUAGE_MAP = {
  zh: "Chinese",
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  fr: "French",
  de: "German",
  es: "Spanish",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  it: "Italian",
  th: "Thai",
  vi: "Vietnamese"
};

const PROVIDER_LANGUAGE_MAPS = {
  "google-free": GOOGLE_LANGUAGE_MAP,
  google: GOOGLE_LANGUAGE_MAP,
  bing: BING_LANGUAGE_MAP,
  "deepl-free": DEEPL_LANGUAGE_MAP,
  deepl: DEEPL_LANGUAGE_MAP,
  ai: AI_LANGUAGE_MAP
};

const PROVIDER_ORDER = ["google-free", "bing", "deepl-free", "deepl", "ai", "google"];
const API_KEY_PROVIDERS = new Set(["deepl", "ai", "google"]);
const REQUEST_LIMIT_WINDOW_MS = 60 * 1000;
const REQUEST_LIMIT_COUNT = 20;
const INPUT_TRANSLATION_MAX_CHARS = 5000;

const SCRIPT_PATTERNS = [
  { script: "hangul", regex: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g },
  { script: "kana", regex: /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/g },
  { script: "cjk", regex: /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/g },
  { script: "thai", regex: /[\u0E00-\u0E7F]/g },
  { script: "arabic", regex: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g },
  { script: "devanagari", regex: /[\u0900-\u097F]/g },
  { script: "cyrillic", regex: /[\u0400-\u04FF\u0500-\u052F]/g },
  { script: "latin", regex: /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]/g }
];

const SCRIPT_LANGUAGE = {
  cjk: "zh",
  kana: "ja",
  hangul: "ko",
  cyrillic: "ru",
  arabic: "ar",
  thai: "th",
  devanagari: "hi",
  latin: "en"
};

const PROVIDERS = {
  "google-free": {
    id: "google-free",
    name: "Google 翻译",
    requiresApiKey: false,
    translate: translateWithGoogleFree
  },
  bing: {
    id: "bing",
    name: "Bing 翻译",
    requiresApiKey: false,
    translate: translateWithBing
  },
  "deepl-free": {
    id: "deepl-free",
    name: "DeepL",
    requiresApiKey: false,
    translate: translateWithDeepLFree
  },
  deepl: {
    id: "deepl",
    name: "DeepL",
    requiresApiKey: true,
    translate: translateWithDeepLApi
  },
  ai: {
    id: "ai",
    name: "AI 翻译",
    requiresApiKey: true,
    translate: translateWithAi
  },
  google: {
    id: "google",
    name: "Google Cloud",
    requiresApiKey: true,
    translate: translateWithGoogleCloud
  }
};

let extensionContext;
let outputChannel;
let translateActionStatusBar;
let resultStatusBar;
let resultDecorationType;
let loadingDecorationType;
let selectionDebounce;
let requestSerial = 0;
let lastSelectionKey = "";
let lastTranslation = null;
let bingAuthToken = null;
let bingAuthExpiresAt = 0;
let deeplRequestId = Math.floor(Math.random() * 99999) + 10000;

const translationCache = new Map();
const requestTimes = [];

function activate(context) {
  extensionContext = context;
  outputChannel = vscode.window.createOutputChannel("Simple Translate");

  translateActionStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
  translateActionStatusBar.text = "$(globe) 翻译选区";
  translateActionStatusBar.tooltip = "Simple Translate: 翻译当前选区";
  translateActionStatusBar.command = "simpleTranslate.translateSelection";

  resultStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  resultStatusBar.command = "simpleTranslate.copyTranslation";

  rebuildDecorationTypes();

  context.subscriptions.push(
    outputChannel,
    translateActionStatusBar,
    resultStatusBar,
    vscode.commands.registerCommand("simpleTranslate.translateSelection", () =>
      translateSelectionCommand({ notify: true })
    ),
    vscode.commands.registerCommand("simpleTranslate.translateAndReplace", () =>
      translateSelectionCommand({ replace: true, notify: false })
    ),
    vscode.commands.registerCommand("simpleTranslate.translateInput", translateInputCommand),
    vscode.commands.registerCommand("simpleTranslate.clearTranslation", clearTranslation),
    vscode.commands.registerCommand("simpleTranslate.copyTranslation", copyLastTranslation),
    vscode.commands.registerCommand("simpleTranslate.toggle", toggleEnabled),
    vscode.commands.registerCommand("simpleTranslate.selectProvider", selectProvider),
    vscode.commands.registerCommand("simpleTranslate.setApiKey", setApiKeyForCurrentProvider),
    vscode.commands.registerCommand("simpleTranslate.testProvider", testCurrentProvider),
    vscode.commands.registerCommand("simpleTranslate.configureShortcut", configureShortcut),
    vscode.commands.registerCommand("simpleTranslate.openSettings", openSettings),
    vscode.window.onDidChangeTextEditorSelection(handleSelectionChange),
    vscode.window.onDidChangeActiveTextEditor((editor) => updateSelectionUi(editor)),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("simpleTranslate")) {
        rebuildDecorationTypes();
        updateSelectionUi(vscode.window.activeTextEditor);
      }
    })
  );

  updateSelectionUi(vscode.window.activeTextEditor);
}

function deactivate() {
  clearSelectionDebounce();
  disposeDecorationTypes();
}

function getConfig() {
  const config = vscode.workspace.getConfiguration("simpleTranslate");
  return {
    enabled: config.get("enabled", true),
    provider: config.get("provider", "bing"),
    triggerMode: config.get("triggerMode", "auto"),
    displayMode: config.get("displayMode", "inline"),
    primaryLangA: config.get("primaryLangA", "zh"),
    primaryLangB: config.get("primaryLangB", "en"),
    apiKeys: config.get("apiKeys", {}),
    aiBaseUrl: config.get("aiBaseUrl", "https://api.openai.com"),
    aiModel: config.get("aiModel", "gpt-4o-mini"),
    fontSize: clampNumber(config.get("fontSize", 15), 10, 28),
    opacity: clampNumber(config.get("opacity", 85), 20, 100),
    chineseRatioThreshold: clampNumber(config.get("chineseRatioThreshold", 0.3), 0.1, 0.9),
    minChars: clampNumber(config.get("minChars", 2), 1, 50),
    maxChars: clampNumber(config.get("maxChars", 500), 50, 5000),
    debounceMs: clampNumber(config.get("debounceMs", 150), 0, 2000),
    blacklistDomains: config.get("blacklistDomains", ""),
    enableCache: config.get("enableCache", true),
    maxCacheEntries: clampNumber(config.get("maxCacheEntries", 100), 10, 1000)
  };
}

function rebuildDecorationTypes() {
  disposeDecorationTypes();
  const config = getConfig();
  const opacity = config.opacity / 100;
  const textDecoration = `none; font-size: ${config.fontSize}px; opacity: ${opacity};`;

  loadingDecorationType = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    after: {
      margin: "0 0 0 1rem",
      color: `rgba(148, 163, 184, ${opacity})`,
      fontStyle: "italic",
      textDecoration
    }
  });

  resultDecorationType = vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    after: {
      margin: "0 0 0 1rem",
      color: `rgba(80, 160, 255, ${opacity})`,
      fontWeight: "600",
      textDecoration
    }
  });
}

function disposeDecorationTypes() {
  if (resultDecorationType) {
    resultDecorationType.dispose();
    resultDecorationType = undefined;
  }
  if (loadingDecorationType) {
    loadingDecorationType.dispose();
    loadingDecorationType = undefined;
  }
}

function handleSelectionChange(event) {
  const config = getConfig();
  const editor = event.textEditor;
  updateSelectionUi(editor);

  if (!config.enabled || config.triggerMode !== "auto") {
    clearSelectionDebounce();
    return;
  }

  const selectionInfo = getSelectionInfo(editor, config, { enforceLength: true });
  if (!selectionInfo) {
    clearSelectionDebounce();
    lastSelectionKey = "";
    clearEditorDecorations(editor);
    return;
  }

  const key = getSelectionKey(editor, selectionInfo);
  if (key === lastSelectionKey) {
    return;
  }
  lastSelectionKey = key;

  clearSelectionDebounce();

  selectionDebounce = setTimeout(() => {
    selectionDebounce = undefined;
    translateSelectionInfo(editor, selectionInfo, { notify: false, reason: "auto" });
  }, config.debounceMs);
}

function clearSelectionDebounce() {
  if (selectionDebounce) {
    clearTimeout(selectionDebounce);
    selectionDebounce = undefined;
  }
}

function updateSelectionUi(editor) {
  const config = getConfig();
  if (!config.enabled || !editor) {
    translateActionStatusBar.hide();
    return;
  }

  const selectionInfo = getSelectionInfo(editor, config, { enforceLength: true });
  if (config.triggerMode === "icon" && selectionInfo) {
    const preview = truncateSingleLine(selectionInfo.text, 40);
    translateActionStatusBar.tooltip = `翻译选区: ${preview}`;
    translateActionStatusBar.show();
  } else {
    translateActionStatusBar.hide();
  }

  if (!selectionInfo && config.triggerMode !== "icon") {
    clearEditorDecorations(editor);
  }
}

async function translateSelectionCommand(options = {}) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Simple Translate: 没有可翻译的活动编辑器。");
    return null;
  }

  const config = getConfig();
  if (!config.enabled) {
    const action = await vscode.window.showInformationMessage(
      "Simple Translate 当前已关闭。",
      "开启",
      "取消"
    );
    if (action === "开启") {
      await setEnabled(true);
    } else {
      return null;
    }
  }

  const selectionInfo = getSelectionInfo(editor, config, { enforceLength: false });
  if (!selectionInfo) {
    return translateInputCommand();
  }

  return translateSelectionInfo(editor, selectionInfo, {
    notify: options.notify,
    replace: options.replace,
    reason: "manual"
  });
}

async function translateSelectionInfo(editor, selectionInfo, options = {}) {
  const config = getConfig();
  const serial = ++requestSerial;
  const sourceLang = detectSourceLanguage(selectionInfo.text, config.primaryLangA, config.primaryLangB, {
    chineseRatioThreshold: config.chineseRatioThreshold
  }) || config.primaryLangB;
  let targetLang = getOppositeLanguage(sourceLang, config.primaryLangA, config.primaryLangB);
  if (targetLang === sourceLang) {
    targetLang = sourceLang === config.primaryLangA ? config.primaryLangB : config.primaryLangA;
  }

  setLoadingDisplay(editor, selectionInfo, config);

  try {
    const result = await translateCore(selectionInfo.text, sourceLang, targetLang, config);
    if (options.reason === "auto" && serial !== requestSerial) {
      return null;
    }

    if (options.replace) {
      await replaceSelection(editor, selectionInfo.selection, result.translatedText);
    }

    presentTranslation(editor, selectionInfo, result, {
      notify: options.notify,
      config
    });

    return result;
  } catch (error) {
    if (options.reason !== "auto" || serial === requestSerial) {
      presentTranslationError(editor, selectionInfo, error, {
        notify: options.reason !== "auto"
      });
    }
    return null;
  }
}

async function translateInputCommand() {
  const text = await vscode.window.showInputBox({
    title: "Simple Translate",
    prompt: "输入要翻译的文本",
    placeHolder: "Hello world",
    ignoreFocusOut: true,
    validateInput(value) {
      if (!value.trim()) {
        return "请输入文本";
      }
      if (value.length > INPUT_TRANSLATION_MAX_CHARS) {
        return `最多 ${INPUT_TRANSLATION_MAX_CHARS} 个字符`;
      }
      return null;
    }
  });

  if (!text || !text.trim()) {
    return null;
  }

  const config = getConfig();
  const sourceLang = detectSourceLanguage(text, config.primaryLangA, config.primaryLangB, {
    chineseRatioThreshold: config.chineseRatioThreshold
  }) || config.primaryLangB;
  let targetLang = getOppositeLanguage(sourceLang, config.primaryLangA, config.primaryLangB);
  if (targetLang === sourceLang) {
    targetLang = sourceLang === config.primaryLangA ? config.primaryLangB : config.primaryLangA;
  }

  resultStatusBar.text = "$(sync~spin) Simple Translate: 正在翻译...";
  resultStatusBar.tooltip = text;
  resultStatusBar.show();

  try {
    const result = await translateCore(text.trim(), sourceLang, targetLang, config);
    lastTranslation = {
      sourceText: text.trim(),
      translatedText: result.translatedText,
      providerName: result.providerName
    };
    appendOutput(lastTranslation);
    showStatusBarResult(result);
    await showTranslationMessage(result, null, null);
    return result;
  } catch (error) {
    const message = getErrorMessage(error);
    resultStatusBar.text = "$(error) Simple Translate: 翻译失败";
    resultStatusBar.tooltip = message;
    resultStatusBar.show();
    await showErrorMessage(message);
    return null;
  }
}

function getSelectionInfo(editor, config, options = {}) {
  if (!editor) {
    return null;
  }

  if (isBlacklisted(editor.document, config.blacklistDomains)) {
    return null;
  }

  const selection = editor.selection;
  if (!selection || selection.isEmpty) {
    return null;
  }

  const rawText = editor.document.getText(selection);
  const text = rawText.trim();
  if (!text) {
    return null;
  }

  if (options.enforceLength !== false && (text.length < config.minChars || text.length > config.maxChars)) {
    return null;
  }

  return {
    text,
    selection,
    decorationRange: new vscode.Range(selection.end, selection.end),
    documentUri: editor.document.uri.toString(),
    documentVersion: editor.document.version
  };
}

function getSelectionKey(editor, selectionInfo) {
  return [
    editor.document.uri.toString(),
    editor.document.version,
    selectionInfo.selection.start.line,
    selectionInfo.selection.start.character,
    selectionInfo.selection.end.line,
    selectionInfo.selection.end.character,
    hashText(selectionInfo.text)
  ].join(":");
}

function setLoadingDisplay(editor, selectionInfo, config) {
  clearEditorDecorations(editor);

  if (shouldUseInlineDisplay(config)) {
    editor.setDecorations(loadingDecorationType, [
      {
        range: selectionInfo.decorationRange,
        renderOptions: {
          after: {
            contentText: "  => 正在翻译..."
          }
        }
      }
    ]);
  }

  resultStatusBar.text = "$(sync~spin) Simple Translate: 正在翻译...";
  resultStatusBar.tooltip = selectionInfo.text;
  resultStatusBar.show();
}

function presentTranslation(editor, selectionInfo, result, options) {
  const config = options.config || getConfig();
  clearEditorDecorations(editor);

  lastTranslation = {
    sourceText: selectionInfo.text,
    translatedText: result.translatedText,
    providerName: result.providerName,
    editorUri: selectionInfo.documentUri,
    selection: selectionInfo.selection
  };

  appendOutput(lastTranslation);

  if (shouldUseInlineDisplay(config)) {
    const hover = buildHoverMarkdown(lastTranslation);
    editor.setDecorations(resultDecorationType, [
      {
        range: selectionInfo.decorationRange,
        hoverMessage: hover,
        renderOptions: {
          after: {
            contentText: `  => ${truncateSingleLine(result.translatedText, 140)}`
          }
        }
      }
    ]);
  }

  showStatusBarResult(result);

  if (options.notify || config.displayMode === "notification" || config.displayMode === "both") {
    showTranslationMessage(result, editor, selectionInfo);
  }
}

function presentTranslationError(editor, selectionInfo, error, options = {}) {
  const message = getErrorMessage(error);
  const config = getConfig();
  clearEditorDecorations(editor);

  if (shouldUseInlineDisplay(config)) {
    editor.setDecorations(resultDecorationType, [
      {
        range: selectionInfo.decorationRange,
        renderOptions: {
          after: {
            contentText: `  => ${truncateSingleLine(message, 100)}`
          }
        }
      }
    ]);
  }

  resultStatusBar.text = "$(error) Simple Translate: 翻译失败";
  resultStatusBar.tooltip = message;
  resultStatusBar.show();
  if (options.notify || config.displayMode === "notification" || config.displayMode === "both") {
    showErrorMessage(message);
  }
}

function clearTranslation() {
  for (const editor of vscode.window.visibleTextEditors) {
    clearEditorDecorations(editor);
  }
  resultStatusBar.hide();
}

function clearEditorDecorations(editor) {
  if (!editor) {
    return;
  }
  if (resultDecorationType) {
    editor.setDecorations(resultDecorationType, []);
  }
  if (loadingDecorationType) {
    editor.setDecorations(loadingDecorationType, []);
  }
}

function shouldUseInlineDisplay(config) {
  return config.displayMode === "inline" || config.displayMode === "both";
}

function showStatusBarResult(result) {
  resultStatusBar.text = `$(comment-discussion) ${truncateSingleLine(result.translatedText, 48)}`;
  resultStatusBar.tooltip = `${result.providerName}: ${result.translatedText}`;
  resultStatusBar.show();
}

async function showTranslationMessage(result, editor, selectionInfo) {
  const message = `${result.providerName}: ${truncateSingleLine(result.translatedText, 900)}`;
  const action = await vscode.window.showInformationMessage(
    message,
    "复制译文",
    editor && selectionInfo ? "替换选区" : "显示输出",
    "打开设置"
  );

  if (action === "复制译文") {
    await vscode.env.clipboard.writeText(result.translatedText);
  } else if (action === "替换选区" && editor && selectionInfo) {
    await replaceSelection(editor, selectionInfo.selection, result.translatedText);
  } else if (action === "显示输出") {
    outputChannel.show(true);
  } else if (action === "打开设置") {
    openSettings();
  }
}

async function showErrorMessage(message) {
  const action = await vscode.window.showErrorMessage(
    `Simple Translate: ${message}`,
    "打开设置",
    "设置 API Key"
  );
  if (action === "打开设置") {
    openSettings();
  } else if (action === "设置 API Key") {
    setApiKeyForCurrentProvider();
  }
}

async function copyLastTranslation() {
  if (!lastTranslation || !lastTranslation.translatedText) {
    vscode.window.showInformationMessage("Simple Translate: 暂无可复制的译文。");
    return;
  }
  await vscode.env.clipboard.writeText(lastTranslation.translatedText);
  vscode.window.showInformationMessage("Simple Translate: 译文已复制。");
}

async function replaceSelection(editor, selection, translatedText) {
  const targetEditor = editor || vscode.window.activeTextEditor;
  if (!targetEditor || !selection) {
    return false;
  }

  const ok = await targetEditor.edit((editBuilder) => {
    editBuilder.replace(selection, translatedText);
  });

  if (ok) {
    vscode.window.showInformationMessage("Simple Translate: 已用译文替换选区。");
  }
  return ok;
}

async function toggleEnabled() {
  const config = getConfig();
  await setEnabled(!config.enabled);
}

async function setEnabled(enabled) {
  await vscode.workspace
    .getConfiguration("simpleTranslate")
    .update("enabled", enabled, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage(`Simple Translate: 已${enabled ? "开启" : "关闭"}划词翻译。`);
  updateSelectionUi(vscode.window.activeTextEditor);
}

async function selectProvider() {
  const config = getConfig();
  const items = PROVIDER_ORDER.map((providerId) => {
    const provider = PROVIDERS[providerId];
    return {
      label: provider.name,
      description: providerId,
      detail: provider.requiresApiKey ? "需要 API Key" : "免费接口",
      providerId,
      picked: providerId === config.provider
    };
  });

  const picked = await vscode.window.showQuickPick(items, {
    title: "选择翻译引擎",
    placeHolder: "选择 Simple Translate 使用的翻译引擎"
  });

  if (!picked) {
    return;
  }

  await vscode.workspace
    .getConfiguration("simpleTranslate")
    .update("provider", picked.providerId, vscode.ConfigurationTarget.Global);

  vscode.window.showInformationMessage(`Simple Translate: 已切换到 ${picked.label}。`);

  const provider = PROVIDERS[picked.providerId];
  if (provider.requiresApiKey && !(await getApiKey(picked.providerId, getConfig()))) {
    await setApiKeyForProvider(picked.providerId);
  }
}

async function setApiKeyForCurrentProvider() {
  const config = getConfig();
  let providerId = config.provider;
  if (!API_KEY_PROVIDERS.has(providerId)) {
    const picked = await vscode.window.showQuickPick(
      [...API_KEY_PROVIDERS].map((id) => ({
        label: PROVIDERS[id].name,
        description: id,
        providerId: id
      })),
      {
        title: "选择要设置 API Key 的引擎"
      }
    );
    if (!picked) {
      return;
    }
    providerId = picked.providerId;
  }

  await setApiKeyForProvider(providerId);
}

async function setApiKeyForProvider(providerId) {
  const provider = PROVIDERS[providerId];
  const value = await vscode.window.showInputBox({
    title: `设置 ${provider.name} API Key`,
    prompt: "API Key 会保存到 VS Code SecretStorage。",
    password: true,
    ignoreFocusOut: true
  });

  if (value === undefined) {
    return;
  }

  const trimmed = value.trim();
  const key = getSecretKey(providerId);
  if (trimmed) {
    await extensionContext.secrets.store(key, trimmed);
    vscode.window.showInformationMessage(`Simple Translate: 已保存 ${provider.name} API Key。`);
  } else {
    await extensionContext.secrets.delete(key);
    vscode.window.showInformationMessage(`Simple Translate: 已清除 ${provider.name} API Key。`);
  }
}

async function testCurrentProvider() {
  const config = getConfig();
  const targetLang = config.primaryLangA === "en" ? config.primaryLangB : config.primaryLangA;
  resultStatusBar.text = "$(sync~spin) Simple Translate: 测试中...";
  resultStatusBar.show();

  try {
    const result = await translateCore("Hello", "en", targetLang, config);
    showStatusBarResult(result);
    await vscode.window.showInformationMessage(`Simple Translate 测试成功: ${result.translatedText}`);
  } catch (error) {
    await showErrorMessage(getErrorMessage(error));
  }
}

async function configureShortcut() {
  const items = [
    {
      label: "翻译选中文本",
      description: "simpleTranslate.translateSelection",
      commandId: "simpleTranslate.translateSelection",
      detail: "给划词翻译主命令绑定任意快捷键"
    },
    {
      label: "翻译并替换选中文本",
      description: "simpleTranslate.translateAndReplace",
      commandId: "simpleTranslate.translateAndReplace",
      detail: "给替换选区命令绑定快捷键"
    },
    {
      label: "输入文本翻译",
      description: "simpleTranslate.translateInput",
      commandId: "simpleTranslate.translateInput",
      detail: "给手动输入翻译命令绑定快捷键"
    }
  ];

  const picked = await vscode.window.showQuickPick(items, {
    title: "配置 Simple Translate 快捷键",
    placeHolder: "选择要绑定快捷键的命令"
  });

  if (!picked) {
    return;
  }

  await vscode.commands.executeCommand(
    "workbench.action.openGlobalKeybindings",
    `@command:${picked.commandId}`
  );

  vscode.window.showInformationMessage(
    `已打开快捷键设置，请为“${picked.label}”绑定你想使用的按键。`
  );
}

function openSettings() {
  vscode.commands.executeCommand("workbench.action.openSettings", "Simple Translate");
}

async function translateCore(text, sourceLang, targetLang, config) {
  ensureFetch();

  const provider = PROVIDERS[config.provider] || PROVIDERS.bing;
  const apiKey = provider.requiresApiKey ? await getApiKey(provider.id, config) : undefined;
  if (provider.requiresApiKey && !apiKey) {
    throw new Error(`请先配置 ${provider.name} 的 API Key`);
  }

  const cacheKey = buildCacheKey(provider.id, sourceLang, targetLang, text, config);
  if (config.enableCache) {
    const cached = getCachedTranslation(cacheKey);
    if (cached) {
      return {
        translatedText: cached,
        providerName: provider.name,
        providerId: provider.id,
        sourceLang,
        targetLang,
        fromCache: true
      };
    }
  }

  if (isRateLimited()) {
    throw new Error("请求过于频繁，请稍后再试");
  }
  recordRequest();

  const translatedText = await provider.translate(text, sourceLang, targetLang, apiKey, config);
  if (!translatedText) {
    throw new Error("翻译结果为空");
  }

  if (config.enableCache) {
    setCachedTranslation(cacheKey, translatedText, config.maxCacheEntries);
  }

  return {
    translatedText,
    providerName: provider.name,
    providerId: provider.id,
    sourceLang,
    targetLang,
    fromCache: false
  };
}

async function getApiKey(providerId, config) {
  const secretKey = getSecretKey(providerId);
  const fromSecretStorage = await extensionContext.secrets.get(secretKey);
  if (fromSecretStorage) {
    return fromSecretStorage;
  }

  const keys = config.apiKeys || {};
  return keys[providerId] || "";
}

function getSecretKey(providerId) {
  return `simpleTranslate.apiKey.${providerId}`;
}

async function translateWithGoogleFree(text, sourceLang, targetLang) {
  const source = mapLanguage(sourceLang, "google-free");
  const target = mapLanguage(targetLang, "google-free");
  const query = new URLSearchParams({
    client: "gtx",
    sl: source,
    tl: target,
    dt: "t",
    q: text
  });
  const response = await fetchWithTimeout(`https://translate.googleapis.com/translate_a/single?${query}`);
  if (response.status === 429) {
    throw new Error("Google 翻译请求过于频繁，请稍后再试");
  }
  if (!response.ok) {
    throw new Error(`Google 翻译错误 ${response.status}`);
  }

  const payload = await response.json();
  const segments = payload && payload[0];
  if (!Array.isArray(segments)) {
    throw new Error("翻译结果格式异常");
  }

  return segments
    .map((segment) => (segment && segment[0]) || "")
    .filter(Boolean)
    .join("");
}

async function translateWithBing(text, sourceLang, targetLang) {
  const token = await getBingAuthToken();
  const source = mapLanguage(sourceLang, "bing");
  const target = mapLanguage(targetLang, "bing");
  const query = new URLSearchParams({
    "api-version": "3.0",
    from: source,
    to: target
  });

  const response = await fetchWithTimeout(
    `https://api-edge.cognitive.microsofttranslator.com/translate?${query}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([{ Text: text }])
    }
  );

  if (response.status === 401) {
    bingAuthToken = null;
    bingAuthExpiresAt = 0;
    throw new Error("Bing 认证已过期，请重试");
  }
  if (!response.ok) {
    throw new Error(`Bing 翻译错误 ${response.status}`);
  }

  const payload = await response.json();
  const translatedText =
    payload &&
    payload[0] &&
    payload[0].translations &&
    payload[0].translations[0] &&
    payload[0].translations[0].text;

  if (!translatedText) {
    throw new Error("翻译结果为空");
  }
  return translatedText;
}

async function getBingAuthToken() {
  if (bingAuthToken && Date.now() < bingAuthExpiresAt) {
    return bingAuthToken;
  }

  const response = await fetchWithTimeout("https://edge.microsoft.com/translate/auth");
  if (!response.ok) {
    throw new Error(`Bing 认证失败 ${response.status}`);
  }

  const token = await response.text();
  bingAuthToken = token;
  try {
    const payload = decodeJwtPayload(token);
    bingAuthExpiresAt = (payload.exp || 0) * 1000 - 30 * 1000;
  } catch {
    bingAuthExpiresAt = Date.now() + 8 * 60 * 1000;
  }

  return token;
}

async function translateWithDeepLFree(text, sourceLang, targetLang) {
  const source = mapLanguage(sourceLang, "deepl-free");
  const target = mapLanguage(targetLang, "deepl-free");
  const response = await fetchWithTimeout("https://www2.deepl.com/jsonrpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Origin: "https://www.deepl.com",
      Referer: "https://www.deepl.com/"
    },
    body: buildDeepLFreeBody(text, source, target)
  });

  if (response.status === 429) {
    throw new Error("DeepL 请求过于频繁，请稍后再试");
  }
  if (!response.ok) {
    throw new Error(`DeepL 错误 ${response.status}`);
  }

  const payload = await response.json();
  const translatedText =
    payload &&
    payload.result &&
    payload.result.texts &&
    payload.result.texts[0] &&
    payload.result.texts[0].text;

  if (!translatedText) {
    throw new Error("翻译结果为空");
  }
  return translatedText;
}

function buildDeepLFreeBody(text, sourceLang, targetLang) {
  const id = ++deeplRequestId;
  const payload = {
    jsonrpc: "2.0",
    method: "LMT_handle_texts",
    id,
    params: {
      texts: [{ text, requestAlternatives: 0 }],
      splitting: "newlines",
      lang: {
        target_lang: targetLang,
        source_lang_user_selected: sourceLang
      },
      timestamp: buildDeepLTimestamp(text),
      commonJobParams: {
        wasSpoken: false,
        transcribe_as: ""
      }
    }
  };

  let body = JSON.stringify(payload);
  if ((id + 3) % 13 === 0 || (id + 5) % 29 === 0) {
    body = body.replace('"method":"', '"method" : "');
  } else {
    body = body.replace('"method":"', '"method": "');
  }
  return body;
}

function buildDeepLTimestamp(text) {
  const now = Date.now();
  const iCount = (text.match(/i/g) || []).length + 1;
  return now - (now % iCount) + iCount;
}

async function translateWithDeepLApi(text, sourceLang, targetLang, apiKey) {
  const source = mapLanguage(sourceLang, "deepl");
  const target = mapLanguage(targetLang, "deepl");
  const endpoint = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
  const body = new URLSearchParams({
    auth_key: apiKey,
    text,
    source_lang: source,
    target_lang: target
  });

  const response = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `DeepL error ${response.status}`);
  }

  const payload = await response.json();
  const translatedText =
    payload &&
    payload.translations &&
    payload.translations[0] &&
    payload.translations[0].text;

  if (!translatedText) {
    throw new Error("No translation in response");
  }
  return translatedText;
}

async function translateWithAi(text, sourceLang, targetLang, apiKey, config) {
  const target = mapLanguage(targetLang, "ai");
  const endpoint = `${config.aiBaseUrl.replace(/\/+$/, "")}/v1/chat/completions`;
  const response = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: config.aiModel,
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the given text to ${target}. Output ONLY the translation, no explanations.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = (payload && payload.error && payload.error.message) || `AI 翻译错误 ${response.status}`;
    throw new Error(message);
  }

  const payload = await response.json();
  const translatedText =
    payload &&
    payload.choices &&
    payload.choices[0] &&
    payload.choices[0].message &&
    payload.choices[0].message.content &&
    payload.choices[0].message.content.trim();

  if (!translatedText) {
    throw new Error("翻译结果为空");
  }
  return translatedText;
}

async function translateWithGoogleCloud(text, sourceLang, targetLang, apiKey) {
  const source = mapLanguage(sourceLang, "google");
  const target = mapLanguage(targetLang, "google");
  const body = new URLSearchParams({
    q: text,
    source,
    target,
    key: apiKey,
    format: "text"
  });

  const response = await fetchWithTimeout(
    `https://translation.googleapis.com/language/translate/v2?${body}`,
    {
      method: "POST"
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = (payload && payload.error && payload.error.message) || `Google Translate error ${response.status}`;
    throw new Error(message);
  }

  const payload = await response.json();
  const translatedText =
    payload &&
    payload.data &&
    payload.data.translations &&
    payload.data.translations[0] &&
    payload.data.translations[0].translatedText;

  if (!translatedText) {
    throw new Error("No translation in response");
  }
  return translatedText;
}

function detectScript(text) {
  if (text.replace(/\s/g, "").length === 0) {
    return "latin";
  }

  let bestScript = "latin";
  let bestCount = 0;
  for (const item of SCRIPT_PATTERNS) {
    const count = (text.match(item.regex) || []).length;
    if (count > bestCount) {
      bestCount = count;
      bestScript = item.script;
    }
  }
  return bestScript;
}

function detectSourceLanguage(text, primaryLangA, primaryLangB, options = {}) {
  const chineseRatioThreshold = options.chineseRatioThreshold || 0.3;
  const script = detectScript(text);

  if (script === "cjk" || script === "kana") {
    const kanaCount = (text.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []).length;
    const cjkCount = (text.match(/[\u4E00-\u9FFF\u3400-\u4DBF]/g) || []).length;
    const total = kanaCount + cjkCount;
    if (total === 0) {
      return null;
    }
    if (kanaCount > 0 && kanaCount / total > 0.1) {
      return "ja";
    }
    const denseText = text.replace(/\s/g, "");
    if (denseText.length > 0 && cjkCount / denseText.length > chineseRatioThreshold) {
      return "zh";
    }
    return "zh";
  }

  const detected = SCRIPT_LANGUAGE[script] || null;
  if (!detected) {
    return null;
  }

  const languageA = LANGUAGE_BY_CODE[primaryLangA];
  const languageB = LANGUAGE_BY_CODE[primaryLangB];
  if (languageA && languageB && languageA.script === script && languageB.script === script) {
    return null;
  }

  return detected;
}

function getOppositeLanguage(sourceLang, primaryLangA, primaryLangB) {
  return sourceLang === primaryLangA ? primaryLangB : primaryLangA;
}

function mapLanguage(language, providerId) {
  const map = PROVIDER_LANGUAGE_MAPS[providerId];
  return (map && map[language]) || language;
}

function ensureFetch() {
  if (typeof fetch !== "function") {
    throw new Error("当前 VS Code 运行时不支持 fetch，请升级 VS Code 到 1.85 或更高版本");
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new Error("请求超时，请检查网络或稍后重试");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function isRateLimited() {
  const now = Date.now();
  while (requestTimes.length > 0 && now - requestTimes[0] > REQUEST_LIMIT_WINDOW_MS) {
    requestTimes.shift();
  }
  return requestTimes.length >= REQUEST_LIMIT_COUNT;
}

function recordRequest() {
  requestTimes.push(Date.now());
}

function getCachedTranslation(key) {
  if (!translationCache.has(key)) {
    return null;
  }
  const value = translationCache.get(key);
  translationCache.delete(key);
  translationCache.set(key, value);
  return value.translatedText;
}

function setCachedTranslation(key, translatedText, maxEntries) {
  translationCache.set(key, {
    translatedText,
    ts: Date.now()
  });

  while (translationCache.size > maxEntries) {
    const firstKey = translationCache.keys().next().value;
    translationCache.delete(firstKey);
  }
}

function buildCacheKey(providerId, sourceLang, targetLang, text, config) {
  const providerVersion =
    providerId === "ai" ? `${config.aiBaseUrl}|${config.aiModel}` : providerId;
  return `${providerVersion}:${sourceLang}:${targetLang}:${hashText(text)}`;
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return hash.toString(36);
}

function isBlacklisted(document, blacklist) {
  if (!blacklist) {
    return false;
  }

  const terms = blacklist
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);

  if (terms.length === 0) {
    return false;
  }

  const haystack = `${document.uri.toString()}\n${document.uri.fsPath || ""}`.toLowerCase();
  return terms.some((term) => haystack.includes(term));
}

function buildHoverMarkdown(translation) {
  const markdown = new vscode.MarkdownString(undefined, true);
  markdown.appendMarkdown(`**Simple Translate (${translation.providerName})**\n\n`);
  markdown.appendMarkdown("**原文**\n\n");
  markdown.appendCodeblock(truncateForMarkdown(translation.sourceText), "");
  markdown.appendMarkdown("\n**译文**\n\n");
  markdown.appendCodeblock(truncateForMarkdown(translation.translatedText), "");
  return markdown;
}

function appendOutput(translation) {
  outputChannel.appendLine(`[${new Date().toLocaleString()}] ${translation.providerName}`);
  outputChannel.appendLine(`Source: ${translation.sourceText}`);
  outputChannel.appendLine(`Result: ${translation.translatedText}`);
  outputChannel.appendLine("");
}

function truncateSingleLine(text, maxLength) {
  const singleLine = String(text).replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) {
    return singleLine;
  }
  return `${singleLine.slice(0, Math.max(0, maxLength - 3))}...`;
}

function truncateForMarkdown(text) {
  const value = String(text);
  if (value.length <= 4000) {
    return value;
  }
  return `${value.slice(0, 4000)}...`;
}

function decodeJwtPayload(token) {
  let payload = (token.split(".")[1] || "").replace(/-/g, "+").replace(/_/g, "/");
  while (payload.length % 4) {
    payload += "=";
  }
  return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return min;
  }
  return Math.min(max, Math.max(min, number));
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error || "翻译失败");
}

module.exports = {
  activate,
  deactivate
};
