import React from 'react'
import { useAuth } from '../../context/AuthContext'
import LoaderModern from '../LoaderModern'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow flex flex-col items-center justify-center relative">
        {loading ? (
          <div className="fixed inset-0 bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#93c5fd] z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
             <LoaderModern size="lg" text="Chargement sécurisé..." />
          </div>
        ) : (
          <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}