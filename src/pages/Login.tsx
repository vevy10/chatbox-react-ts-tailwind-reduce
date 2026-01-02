import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Lock, User, ShieldCheck, Loader2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const LoginPage = () => {
  const { login, error, loading } = useAuth()
  const location = useLocation()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const successMsg = location.state?.message

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd]">
      <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full border-2 border-white/50 bg-white/5">
            <User size={48} className="text-white" strokeWidth={1} />
          </div>
        </div>
        
        <h2 className="text-4xl font-light text-white mb-10 tracking-wide">Connexion</h2>
        {successMsg && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center justify-center gap-2 text-green-100 text-sm animate-in fade-in zoom-in duration-300">
            <ShieldCheck size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative border-b border-white/60 pb-2 flex items-center gap-4 group">
            <User className="text-white/80 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Email ou Téléphone" 
              className="bg-transparent w-full text-white placeholder-white/70 outline-none"
              onChange={e => setForm({...form, identifier: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <div className="relative border-b border-white/60 pb-2 flex items-center gap-4 group">
            <Lock className="text-white/80 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="bg-transparent w-full text-white placeholder-white/70 outline-none"
              onChange={e => setForm({...form, password: e.target.value})}
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-white/80 px-1">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="rounded bg-transparent border-white accent-blue-500" />
              Rester connecté
            </label>
            <Link to="/forgot-password" className="hover:underline italic hover:text-white">
                Mot de passe oublié ?
            </Link>
          </div>

          {error && (
            <div className="text-red-200 text-sm bg-red-500/20 py-2 px-4 rounded-lg border border-red-500/30 animate-shake">
                {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-3 rounded-xl shadow-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-widest mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Vérification...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <p className="mt-8 text-white/80 text-sm">
          Pas encore de compte ? <Link to="/signup" className="font-bold hover:underline text-white ml-1">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}