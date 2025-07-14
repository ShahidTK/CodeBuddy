import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import axios from "axios";
import useThemeStore from "../store/useThemeStore";

// Connect to socket server
const socket = io("http://localhost:5001");

const CodeEditor = () => {
  const { theme } = useThemeStore();
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
  ];

  // Socket listeners
  useEffect(() => {
    socket.on("codeChange", (newCode) => {
      setCode(newCode);
    });

    socket.on("languageChange", (newLang) => {
      setLanguage(newLang);
    });

    return () => {
      socket.off("codeChange");
      socket.off("languageChange");
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", newCode);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("languageChange", newLang);
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setOutput("Running...");
    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        source: code,
      });
      setOutput(response.data.run.stdout || response.data.run.stderr || "No output");
    } catch (error) {
      setOutput("Error: " + (error.response?.data?.message || "Compilation failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      {/* Controls */}
      <div className={`flex justify-between items-center p-2 border-b ${
        theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
      }`}>
        <div className="flex space-x-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className={`${
              theme === 'light' ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-gray-200'
            } border rounded px-3 py-1 text-sm`}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className={`${
              theme === 'light' ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-gray-200'
            } border rounded px-3 py-1 text-sm`}
          >
            {[12, 13, 14, 15, 16, 17, 18].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompile}
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-1 rounded text-sm flex items-center`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : (
            "Run Code"
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          theme={editorTheme}
          language={language}
          value={code}
          onChange={handleCodeChange}
          options={{
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            fontFamily: "'Fira Code', monospace",
            lineNumbers: "on",
          }}
        />
      </div>

      {/* Output */}
      <div className={`border-t p-3 ${
        theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
      }`}>
        <div className={`font-medium mb-1 ${
          theme === 'light' ? 'text-gray-800' : 'text-gray-200'
        }`}>
          Output:
        </div>
        <pre className={`p-2 rounded text-sm overflow-auto max-h-32 font-mono ${
          theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-700 text-gray-200'
        }`}>
          {output || "Your output will appear here..."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
