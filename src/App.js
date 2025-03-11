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

      {/* Language Selector */}
      <select value={language} onChange={handleLanguageChange}>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </select>

      {/* Monaco Code Editor */}
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
      />

      {/* Input Box for providing stdin */}
      <textarea
        placeholder="Enter input here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', height: '100px', marginTop: '20px', padding: '10px' }}
      />

      {/* Compile Button */}
      <button onClick={submitCode} disabled={isLoading} style={{ marginTop: '20px', padding: '10px 20px' }}>
        {isLoading ? 'Compiling...' : 'Compile Code'}
      </button>

      {/* Output Display */}
      <div style={{ marginTop: '20px', width: '100%', height: '200px', overflowY: 'scroll', backgroundColor: '#f4f4f4', padding: '10px' }}>
        <h4>Output:</h4>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
