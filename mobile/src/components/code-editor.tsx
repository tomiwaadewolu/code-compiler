import React, { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";

type Props = {
  code: string;
  language: string;
  onChange: (code: string) => void;
};

export default function CodeEditor({ code, language, onChange }: Props) {
  const webRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    webRef.current?.postMessage(JSON.stringify({ type: "setCode", value: code }));
    webRef.current?.postMessage(JSON.stringify({ type: "setLanguage", value: language }));
  }, [code, language, isReady]);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    html, body, #container {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
  </style>
</head>
<body>
  <div id="container"></div>

  <script src="https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js"></script>
  <script>
    require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }});

    let editor;
    let isUpdatingFromRN = false;

    require(['vs/editor/editor.main'], function () {
      monaco.editor.defineTheme('modern-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A6A6A' },
          { token: 'string', foreground: '0167B8' },
          { token: 'number', foreground: '0167B8' },
          { token: 'keyword', foreground: '9B4DCA' },
          { token: 'type', foreground: '7C3BAC' },
          { token: 'variable', foreground: '24152F' },
        ],
        colors: {
          'editor.background': '#FFFFFF',
          'editor.foreground': '#24152F',
          'editor.lineNumbersBackground': '#FCF9FF',
          'editor.lineNumbersForeground': '#9A87B0',
          'editor.selectionBackground': '#F1E5FF',
          'editor.lineHighlightBackground': '#F8F1FF',
          'editor.wordHighlightBackground': '#F3E5FF',
          'editor.findMatchBackground': '#E9D8FF',
          'editorCursor.foreground': '#9B4DCA',
          'editorIndentGuide.background': '#EADCF6',
          'editorIndentGuide.activeBackground': '#D9BEF0',
        }
      });

      editor = monaco.editor.create(document.getElementById('container'), {
        value: ${JSON.stringify(code)},
        language: ${JSON.stringify(language)},
        theme: 'modern-light',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingIndent: 'indent',
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: 'blink',
        renderLineHighlight: 'gutter',
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        formatOnPaste: true,
        formatOnType: true,
      });

      editor.onDidChangeModelContent(() => {
        if (isUpdatingFromRN) {
          return;
        }

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'codeChange',
            value: editor.getValue(),
          })
        );
      });

      window.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data || '{}');

        if (msg.type === 'setCode' && editor) {
          const current = editor.getValue();

          if (current !== msg.value) {
            isUpdatingFromRN = true;
            editor.setValue(msg.value);
            isUpdatingFromRN = false;
          }
        }

        if (msg.type === 'setLanguage' && editor && editor.getModel()) {
          monaco.editor.setModelLanguage(editor.getModel(), msg.value);
        }
      });
    });
  </script>
</body>
</html>
`;

  return (
    <WebView
      ref={webRef}
      originWhitelist={["*"]}
      source={{ html }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={(event) => {
        try {
          const msg = JSON.parse(event.nativeEvent.data);

          if (msg.type === "codeChange") {
            onChange(msg.value);
          }
        } catch (e) {
          // no-op
        }
      }}
      onLoadEnd={() => setIsReady(true)}
      style={{ flex: 1 }}
    />
  );
}
