import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import CodeEditor from "./CodeEditor";
import useThemeStore from "../store/useThemeStore.js"; 

const CodeChat = () => {
  const { selectedUser } = useChatStore();
  const { theme } = useThemeStore(); // Get current theme

  return (
    <div className={`mt-16 h-[calc(100vh-4rem)] ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div className="flex h-full">
        {/* Left Half: Code Editor - 60% width */}
        <div className={`w-[55%] border-r ${
          theme === 'dark' ? 'border-gray-700' : 
          theme === 'light' ? 'border-gray-200' :
          'border-gray-200' // default
        }`}>
          <CodeEditor />
        </div>

        <div className="w-[45%] flex">
          <div className={`w-[35%] h-full flex flex-col border-r ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 
            theme === 'light' ? 'border-gray-200 bg-white' :
            'border-gray-200 bg-white' 
          }`}>
            <Sidebar />
          </div>

          <div className={`w-[65%] flex flex-col relative ${
            theme === 'dark' ? 'bg-gray-900' : 
            theme === 'light' ? 'bg-white' :
            'bg-white' 
          }`}>
            <div className={`absolute left-0 top-0 bottom-0 w-px ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            } z-10`}></div>
            
            {!selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeChat;