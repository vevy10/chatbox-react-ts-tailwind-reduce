import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'AUTH | Accueil',
  '/login': 'AUTH | Se connecter',
  '/signup': 'AUTH | Créer un compte',
  '/dashboard': 'AUTH | Tableau de bord',
};

const DynamicTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const title = titles[location.pathname] || 'AUTH | Application'
    document.title = title
  }, [location])

  return null
}

export default DynamicTitle