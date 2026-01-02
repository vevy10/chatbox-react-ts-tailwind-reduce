import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Key, ArrowLeft, Loader2 } from 'lucide-react'
import { forgotPassword, resetPassword } from '../services/auth.service'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await forgotPassword(identifier)
      setStep(2)
    } catch (err: any) {
      setError(err.message || "Impossible d'envoyer le code")
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await resetPassword(identifier, code, newPassword)
      navigate('/login', { state: { message: "Votre mot de passe a été réinitialisé !" } })
    } catch (err: any) {
      setError(err.message || "Code invalide ou erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd]">
      <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        
        <Link to="/login" className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors w-fit">
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full border-2 border-white/50 bg-white/5 text-white">
            {step === 1 ? <Mail size={40} strokeWidth={1} /> : <Key size={40} strokeWidth={1} />}
          </div>
        </div>

        <h2 className="text-3xl font-light text-white mb-4 tracking-wide">
          {step === 1 ? 'Mot de passe oublié' : 'Réinitialisation'}
        </h2>
        
        <p className="text-white/70 text-sm mb-8 px-4">
          {step === 1 
            ? "Entrez votre email ou téléphone pour recevoir un code de sécurité." 
            : "Saisissez le code reçu et votre nouveau mot de passe."}
        </p>

        <form onSubmit={step === 1 ? handleRequestCode : handleResetSubmit} className="space-y-8">
          
          {step === 1 ? ( 
            <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
              <Mail className="text-white/80" size={20} />
              <input 
                type="text" 
                placeholder="Email ou Téléphone" 
                className="bg-transparent w-full text-white placeholder-white/70 outline-none"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          ) : (
            <>
              <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
                <Key className="text-white/80" size={20} />
                <input 
                  type="text" 
                  placeholder="Code de vérification" 
                  className="bg-transparent w-full text-white placeholder-white/70 outline-none"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative border-b border-white/60 pb-2 flex items-center gap-4">
                <Lock className="text-white/80" size={20} />
                <input 
                  type="password" 
                  placeholder="Nouveau mot de passe" 
                  className="bg-transparent w-full text-white placeholder-white/70 outline-none"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-200 text-sm bg-red-500/20 py-2 px-4 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-3 rounded-xl shadow-lg font-semibold hover:bg-blue-700 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              step === 1 ? 'Envoyer le code' : 'Changer le mot de passe'
            )}
          </button>
        </form>

        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="mt-6 text-xs text-white/60 hover:text-white underline cursor-pointer"
          >
            Renvoyer un nouveau code
          </button>
        )}
      </div>
    </div>
  )
}