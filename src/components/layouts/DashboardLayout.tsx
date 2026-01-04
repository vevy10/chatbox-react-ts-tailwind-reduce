import { Sidebar } from './Sidebar'

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 bg-linear-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[92vh] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-black/5 custom-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  )
}