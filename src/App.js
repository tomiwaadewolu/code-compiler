import React, { useState } from 'react';
import './App.css';
import { Editor } from '@monaco-editor/react'; // Monaco Editor
import axios from 'axios';

function App() {
  // State to store code, language, input, and results
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle language change
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  // Function to handle the submit (compile) action
  const submitCode = async () => {
    setIsLoading(true); // Start loading indicator
    try {
      console.log('Sending request to backend...');
      const response = await axios.post('http://localhost:8000/compile', {
        code: code,
        language: language,
        input: input,
      });

      console.log('Response received:', response.data);
      setOutput(response.data.output || response.data.error); // Set the output from the response
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput('Error compiling code: ' + error.message);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Code Compiler</h1>
      </header>

      <div className="main-container">
        {/* Left container: Code Editor */}
        <div className="code-editor-container">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
          />
        </div>

        {/* Right container: Split between Input & Output */}
        <div className="right-container">
          {/* Input Container */}
          <div className="input-container">
            <textarea
              placeholder="Enter input here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: '100%', height: '100%', padding: '10px' }}
            />
          </div>

          {/* Output Container */}
          <div className="output-container">
            <h4>Output:</h4>
            <pre>{output}</pre>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <select value={language} onChange={handleLanguageChange}>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </select>

      {/* Compile Button */}
      <button onClick={submitCode} disabled={isLoading} style={{ marginTop: '20px', padding: '10px 20px' }}>
        {isLoading ? 'Compiling...' : 'Compile Code'}
      </button>
    </div>
  );
}

export default App;
