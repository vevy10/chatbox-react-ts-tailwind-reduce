import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Mail, Lock, UserCircle, UserPlus, Phone, Users } from 'lucide-react'

export const SignupPage = () => {
  const { register, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    sexe: 'M',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(formData)
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd] overflow-y-auto py-10">
      <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl my-auto">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full border-2 border-white/50">
            <UserPlus size={40} className="text-white" strokeWidth={1} />
          </div>
        </div>
        
        <h2 className="text-3xl font-light text-white mb-8 tracking-wide">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative border-b border-white/60 pb-2 flex items-center gap-3">
              <UserCircle className="text-white/80" size={18} />
              <input 
                type="text" placeholder="Prénom" className="bg-transparent w-full text-white placeholder-white/70 outline-none text-sm"
                onChange={e => setFormData({...formData, first_name: e.target.value})} required
              />
            </div>
            <div className="relative border-b border-white/60 pb-2 flex items-center gap-3">
              <input 
                type="text" placeholder="Nom" className="bg-transparent w-full text-white placeholder-white/70 outline-none text-sm"
                onChange={e => setFormData({...formData, last_name: e.target.value})} required
              />
            </div>
          </div>

          <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
            <Mail className="text-white/80" size={18} />
            <input 
              type="email" placeholder="Adresse Email" className="bg-transparent w-full text-white placeholder-white/70 outline-none text-sm"
              onChange={e => setFormData({...formData, email: e.target.value})} required
            />
          </div>

          <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
            <Phone className="text-white/80" size={18} />
            <input 
              type="tel" placeholder="Téléphone" className="bg-transparent w-full text-white placeholder-white/70 outline-none text-sm"
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
            <Users className="text-white/80" size={18} />
            <select 
              className="bg-transparent w-full text-white outline-none text-sm cursor-pointer"
              onChange={e => setFormData({...formData, sexe: e.target.value})}
              value={formData.sexe}
            >
              <option value="M" className="text-blue-900">Homme</option>
              <option value="F" className="text-blue-900">Femme</option>
              <option value="Autre" className="text-blue-900">Autre</option>
            </select>
          </div>

          <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
            <Lock className="text-white/80" size={18} />
            <input 
              type="password" placeholder="Mot de passe" className="bg-transparent w-full text-white placeholder-white/70 outline-none text-sm"
              onChange={e => setFormData({...formData, password: e.target.value})} required
            />
          </div>

          {error && <p className="text-red-200 text-xs bg-red-500/30 py-2 rounded">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-blue-800 text-white py-3 rounded shadow-lg font-semibold hover:bg-blue-900 transition-all uppercase tracking-widest mt-4 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-6 text-white/80 text-xs">
          Déjà inscrit ? <Link to="/login" className="font-bold hover:underline text-white">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}