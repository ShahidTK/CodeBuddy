import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { theme } = useThemeStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  // Filter users to show only those who are online
  const onlineUserList = users.filter(user => onlineUsers.includes(user._id));

  return (
    <aside className={`h-full w-20 lg:w-64 border-l flex flex-col transition-all duration-200 ${
      theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <div className={`border-b w-full p-4 ${
        theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          <Users className={`size-5 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} />
          <span className={`font-medium hidden lg:block ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Active People
          </span>
        </div>

        <div className={`mt-1 hidden lg:block text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {onlineUsers.length} {onlineUsers.length === 1 ? "person online" : "people"}
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1">
        {onlineUserList.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-4 flex items-center gap-4 transition-colors ${
              theme === 'dark' ? 
                selectedUser?._id === user._id ? 'bg-gray-700' : 'hover:bg-gray-700' : 
                selectedUser?._id === user._id ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className={`size-14 object-cover rounded-full border-2 ${
                  theme === 'dark' ? 'border-gray-800' : 'border-white'
                }`}
              />
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className={`font-medium truncate text-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {user.fullName}
              </div>
            </div>
          </button>
        ))}

        {onlineUserList.length === 0 && (
          <div className={`text-center py-8 px-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No users online
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 