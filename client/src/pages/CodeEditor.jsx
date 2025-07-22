import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import useThemeStore from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

// Connect to socket server

const CodeEditor = () => {
  const {socket} = useAuthStore();
  const { theme } = useThemeStore();
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const JudgeOApi = import.meta.env.VITE_JUDGE0_URL
  const RapidKey = import.meta.env.VITE_RAPID_API_KEY
  const [languageId, setLanguageId] = useState(54)
  const [stdin, setStdin] = useState('')

  const editorTheme = theme === 'light' ? 'vs' : 'vs-dark';

  const languageOptions = [
    { value: "javascript", label: "JavaScript", language_id: 63 },
    { value: "python", label: "Python", language_id: 71  },
    { value: "c", label: "C" , language_id: 50 },
    { value: "cpp", label: "C++" , language_id: 54 },
    { value: "java", label: "Java" , language_id: 62 },
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
    const selectedValue = e.target.value;
    const selectedLang = languageOptions.find(
      (lang) => lang.value === selectedValue
    );
    if (selectedLang) {
      setLanguageId(selectedLang.language_id);
      setLanguage(selectedLang.value);
      socket.emit("languageChange", selectedLang.value);
    }
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setOutput("Running...");
    console.log(stdin)
    try {
      const submissionResponse = await axios.post(JudgeOApi, {
        source_code: code,
        language_id  : languageId,
        stdin: stdin || ''
      }, {headers : {
        "X-RapidAPI-Key": RapidKey,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
         "Content-Type": "application/json",
      }});
      const token = submissionResponse.data.token;

      let statusId = 1;
    let resultData = null;

    while (statusId === 1 || statusId === 2) {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // wait before polling
      const resultRes = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "X-RapidAPI-Key": RapidKey,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      resultData = resultRes.data;
      statusId = resultData.status?.id; // 1=In Queue, 2=Processing
    }

    if (resultData.stdout) {
      setOutput(resultData.stdout);
    } else if (resultData.stderr) {
      setOutput(`Runtime Error:\n${resultData.stderr}`);
    } else if (resultData.compile_output) {
      setOutput(`Compilation Error:\n${resultData.compile_output}`);
    } else {
      setOutput("No output received.");
    }

    } catch (error) {
      console.log(error)
      if(error.status===429){
        setOutput("You’ve reached your daily compilation limit. Upgrade to Premium for unlimited access");
      }
      else {
        setOutput("Compilation failed due to an unknown error.")
      }
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
      <div className="flex-1 h-[80%] overflow-y-scroll">
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
      {/* Output  & input*/}
      <div className=" flex flex-row gap-2 h-[20%] ">
        {/* output section */}
        <div className={`border-t p-3 overflow-y-scroll w-1/2 ${
          theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
        }`}>
          <div className={`font-medium mb-1 ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
          }`}>
            Output:
          </div>
          <pre className={`p-2 rounded text-sm h-full font-mono ${
            theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-700 text-gray-200'
          }`}>
            {output || "Your output will appear here..."}
          </pre>
        </div>

        {/* input section */}
        <div className={`border-t p-3 overflow-y-scroll w-1/2 ${
          theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-800'
        }`}>
          <div className={`font-medium mb-1 ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
          }`}>
            Input:
          </div>
          <pre className={`p-2 rounded text-sm h-full font-mono ${
            theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-700 text-gray-200'
          }`}>
          <textarea
            value={stdin}  // ✅ controlled by React state
            onChange={(e) => setStdin(e.target.value)} // ✅ update stdin
            placeholder="Enter inputs here"
            rows={4}
            className={`w-full mt-1 p-2 rounded text-sm font-mono ${
              theme === 'light'
              ? 'bg-white text-gray-800 border border-gray-300'
              : 'bg-gray-700 text-gray-200 border border-gray-600'
            }`} />
            </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
