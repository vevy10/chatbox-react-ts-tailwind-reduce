import { LayoutDashboard, MessageSquare, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export const Sidebar = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', path: '/chat' },
    { icon: Settings, label: 'Paramètres', path: '#' },
  ]

  return (
    <div className="w-72 flex flex-col bg-[#0f172a]/80 backdrop-blur-2xl border-r border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
              <span className="text-transparent bg-clip-text bg-linear-to-tr from-blue-400 to-white font-black text-2xl">C</span>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white uppercase">Chat<span className="text-blue-500">box</span></h1>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                )}
                <item.icon size={20} className={`${isActive ? 'text-blue-400' : 'group-hover:text-blue-300 transition-colors'}`} />
                <span className="text-[14px] font-semibold tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 bg-slate-950/40 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 p-px">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
               {user?.profile_photo ? <img src={`http://127.0.0.1:8000/${user.profile_photo}`} className="object-cover" /> : user?.first_name?.charAt(0)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-bold truncate">{user?.first_name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 uppercase font-medium">En ligne</span>
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 py-3 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-red-400 group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold text-slate-400 group-hover:text-red-400 uppercase tracking-widest">Déconnexion</span>
        </button>
      </div>
    </div>
  )
}