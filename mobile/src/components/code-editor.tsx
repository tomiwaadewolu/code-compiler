import React, { useRef } from "react";
import { WebView } from "react-native-webview";

type Props = {
  code: string;
  language: string;
  onChange: (code: string) => void;
};

export default function CodeEditor({ code, language, onChange }: Props) {
  const webRef = useRef<WebView>(null);

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
    
    body {
      background: #0D1117;
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

    // Define custom theme for modern look
    require(['vs/editor/editor.main'], function () {
      monaco.editor.defineTheme('modern-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '8B949E' },
          { token: 'string', foreground: '79C0FF' },
          { token: 'number', foreground: '79C0FF' },
          { token: 'keyword', foreground: 'FF7B72' },
          { token: 'type', foreground: 'FFB657' },
          { token: 'variable', foreground: 'C9D1D9' },
        ],
        colors: {
          'editor.background': '#0D1117',
          'editor.foreground': '#E6EDF3',
          'editor.lineNumbersBackground': '#010409',
          'editor.lineNumbersForeground': '#30363D',
          'editor.selectionBackground': '#388BFD33',
          'editor.lineHighlightBackground': '#161B2204',
          'editor.wordHighlightBackground': '#388BFD22',
          'editor.findMatchBackground': '#388BFD66',
          'editorCursor.foreground': '#58A6FF',
          'editorIndentGuide.background': '#30363D',
          'editorIndentGuide.activeBackground': '#30363D',
        }
      });

      editor = monaco.editor.create(document.getElementById('container'), {
        value: "",
        language: "${language}",
        theme: "modern-dark",
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
          strings: false
        },
        formatOnPaste: true,
        formatOnType: true
      });

      // Send changes to React Native
      editor.onDidChangeModelContent(() => {
        if (isUpdatingFromRN) return;

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "codeChange",
            value: editor.getValue()
          })
        );
      });

      // Receive updates from React Native
      window.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data || "{}");

        if (msg.type === "setCode") {
          if (editor) {
            const current = editor.getValue();

            if (current !== msg.value) {
              isUpdatingFromRN = true;
              editor.setValue(msg.value);
              isUpdatingFromRN = false;
            }
          }
        }

        if (msg.type === "setLanguage") {
          if (editor && editor.getModel()) {
            monaco.editor.setModelLanguage(editor.getModel(), msg.value);
          }
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
        } catch (e) {}
      }}
      onLoadEnd={() => {
        webRef.current?.postMessage(
          JSON.stringify({ type: "setCode", value: code })
        );
      }}
      style={{ flex: 1 }}
    />
  );
}