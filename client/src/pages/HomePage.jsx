import React from "react";
import { useNavigate } from "react-router-dom";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { CodeBracketIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/solid';
import Navbar from "../components/Navbar";
import useThemeStore from "../store/useThemeStore";

const HomePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              Code Together. <br />
              Build Better.
            </h1>
            <p className={`text-lg font-medium max-w-2xl mx-auto mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              A real-time collaborative coding platform with integrated chat.<br />
              Perfect for remote teams, mentors, and peer programmers.
            </p>
            
            <button 
              onClick={() => navigate('/CodeEditor')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-lg hover:from-blue-600 hover:to-purple-700"
            >
              Start New Session
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          <FeatureCard 
          icon={<CodeBracketIcon className="w-6 h-6" />}
          title="Real-time Coding"
          description="Collaborate on code with live updates and synchronized editing."
          theme={theme}
        />
        <FeatureCard 
          icon={<ChatBubbleLeftIcon className="w-6 h-6" />}
          title="Integrated Chat"
          description="Discuss code changes without leaving the editor."
          theme={theme}
        />
        <FeatureCard 
          icon={<ShareIcon className="w-6 h-6" />}
          title="Code Sharing"
          description="Share your code with others and get feedback easily."
          theme={theme}
        />

          </div>
        </div>
      </main>

      <footer className={`py-6 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © {new Date().getFullYear()} CodeChat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, theme }) => {
  return (
    <div className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border ${
      theme === 'dark' ? 
        'bg-gray-800 border-gray-700 hover:border-gray-600' : 
        'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg mr-4 ${
          theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
        }`}>
          {icon}
        </div>
        <h3 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
      </div>
      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
        {description}
      </p>
    </div>
  );
};

export { HomePage, FeatureCard };