import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, LogOut, ShieldCheck, Key, User, Camera, Mail, Phone } from 'lucide-react'
import { useRef } from 'react'

export const DashboardPage = () => {
  const { token, logout, user, updatePhoto } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user?.id) {
      await updatePhoto(user.id, file)
    }
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd] p-6">
      <div className="max-w-5xl mx-auto pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center mb-10 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
              <LayoutDashboard size={28} />
            </div>
            <h1 className="text-2xl font-light tracking-tight">Tableau de Bord</h1>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-white/10 hover:bg-red-500/40 backdrop-blur-md px-4 py-2 rounded-xl transition-all border border-white/30 group cursor-pointer"
          >
            <span className="text-sm font-medium text-white">Déconnexion</span>
            <LogOut size={18} className="text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-6" onClick={handlePhotoClick}>
              <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 flex items-center justify-center">
                {user?.profile_photo ? (
                  <img 
                    src={`http://127.0.0.1:8000/${user.profile_photo}`} 
                    alt="Profil" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User size={60} className="text-white/40" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            
            <h3 className="text-2xl font-semibold text-white">
              {user?.first_name || 'Utilisateur'} {user?.last_name || ''}
            </h3>
            <p className="text-cyan-200 text-sm mb-6 uppercase tracking-widest font-medium">Membre Premium</p>
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-white/70 text-sm bg-white/5 p-3 rounded-2xl">
                <Mail size={16} /> <span>{user?.email || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm bg-white/5 p-3 rounded-2xl">
                <Phone size={16} /> <span>{user?.phone || 'Non renseigné'}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Statut du compte', val: 'Vérifié', icon: ShieldCheck, color: 'text-cyan-300' },
                { label: 'Token de session', val: `${token?.substring(0, 12)}...`, icon: Key, color: 'text-white/70' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-xl">
                  <item.icon className={`mb-3 ${item.color}`} size={24} />
                  <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">{item.label}</p>
                  <p className={`text-xl font-semibold mt-1 ${item.color} truncate`}>{item.val}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group h-full min-h-75">
              <div className="relative z-10">
                <h2 className="text-4xl font-light text-white mb-6">Content de vous revoir, {user?.first_name || 'Ami'} !</h2>
                <p className="text-white/80 max-w-lg leading-relaxed mb-8">
                  Votre espace personnel est sécurisé. Vous pouvez maintenant modifier vos informations ou uploader une nouvelle photo de profil en cliquant sur l'avatar.
                </p>
                <button className="bg-white text-[#1e3a8a] px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                  Éditer mon profil
                </button>
              </div>
              <div className="absolute top-10 right-10 opacity-5">
                 <LayoutDashboard size={180} className="text-white" strokeWidth={0.5} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}