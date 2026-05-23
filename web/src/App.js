import React, { useState } from 'react';
import './App.css';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

const defaultCode = {
  c: `#include <stdio.h>\nint main() {\n    printf("Hello, C!");\n    return 0;\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}\n`,
  python: `print("Hello, Python!")\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n       System.out.println("Hello, Java!");\n    }\n}\n`
};


function App() {
  const [code, setCode] = useState(defaultCode.python);
  const [language, setLanguage] = useState('python');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('Your compiled output will appear here.');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    setCode(defaultCode[selectedLang]);
  };

  const submitCode = async () => {
    if (!code.trim()) {
      setOutput('⚠️ No code in the editor. Please write code or select a language to load the starter snippet.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/compile', {
        code,
        language,
        input,
      });

      setOutput(response.data.output || response.data.error);
    } catch (error) {
      setOutput('Error compiling code: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="App-shell">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Code Compiler</p>
            <h1>Modern coding, wrapped in a cleaner workspace.</h1>
            <p className="subtitle">
              A streamlined editor layout with smoother spacing, sharper controls, and a polished visual system.
            </p>
          </div>

          <div className="hero-controls">
            <label className="control-label" htmlFor="language-select">
              Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              className="language-select"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="editor-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Editor</p>
                <h2>Code canvas</h2>
              </div>
              <span className="status-pill">Live</span>
            </div>

            <div className="editor-frame">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 18, bottom: 18 },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  roundedSelection: true,
                }}
              />
            </div>
          </div>

          <div className="side-panel">
            <div className="input-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Input</p>
                  <h2>Runtime input</h2>
                </div>
              </div>

              <textarea
                className="input-area"
                placeholder="Enter stdin here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="output-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Output</p>
                  <h2>Results</h2>
                </div>
              </div>

              <pre className="output-area">{output}</pre>
            </div>
          </div>
        </section>

        <div className="footer-row">
          <p className="footer-note">Use the polished workspace to test snippets.</p>
          <button className="compile-button" onClick={submitCode} disabled={isLoading}>
            {isLoading ? 'Compiling…' : 'Compile code'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
