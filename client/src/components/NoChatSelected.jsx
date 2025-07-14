import { MessageSquare } from "lucide-react";
import useThemeStore from "../store/useThemeStore";

const NoChatSelected = () => {
  const { theme } = useThemeStore();

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center animate-bounce ${
            theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
          }`}>
            <MessageSquare className={`w-6 h-6 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
        </div>

        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Welcome to CodeBuddy!
        </h2>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;  