import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Key, Mail, LayoutDashboard } from 'lucide-react'
import { useRef } from 'react'
import { DashboardLayout } from '../components/layouts/DashboardLayout'

export const DashboardPage = () => {
  const { token, user, updatePhoto } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user?.id) await updatePhoto(user.id, file)
  }

  return (
    <DashboardLayout>
      <div className="p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-10">
          <h2 className="text-3xl font-light text-white">Bonjour, <span className="font-semibold">{user?.first_name}</span></h2>
          <p className="text-white/40 text-sm mt-1">Voici le résumé de votre activité aujourd'hui.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                   <div className="w-28 h-28 rounded-full border-2 border-white/10 overflow-hidden bg-blue-500/20 flex items-center justify-center">
                      {user?.profile_photo ? <img src={`http://127.0.0.1:8000/${user.profile_photo}`} className="w-full h-full object-cover" /> : <LayoutDashboard size={40} className="text-blue-400" />}
                   </div>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <h3 className="text-xl font-bold text-white">{user?.first_name} {user?.last_name}</h3>
                <div className="w-full mt-6 space-y-3">
                   <div className="flex items-center gap-3 text-white/50 text-[11px] bg-white/5 p-3 rounded-xl border border-white/5">
                      <Mail size={14} /> <span className="truncate">{user?.email}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                   <ShieldCheck className="text-emerald-400 mb-3" size={20} />
                   <p className="text-[10px] text-white/30 uppercase font-black">Sécurité</p>
                   <p className="text-white font-medium">Compte vérifié</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                   <Key className="text-blue-400 mb-3" size={20} />
                   <p className="text-[10px] text-white/30 uppercase font-black">Session</p>
                   <p className="text-white font-medium truncate">{token?.substring(0, 15)}...</p>
                </div>
             </div>
             
             <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-2">Prêt pour un nouveau projet ?</h3>
                <p className="text-white/70 text-sm mb-6">Accédez à vos messages prioritaires pour ne rien rater.</p>
                <button className="bg-white text-blue-900 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
                   Lancer le chat
                </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}