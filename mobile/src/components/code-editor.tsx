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

      editor = monaco.editor.create(document.getElementById('container'), {
        value: "",
        language: "${language}",
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false }
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