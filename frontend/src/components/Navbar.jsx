import { Link } from 'react-router-dom'
import { HomeIcon, PlusCircleIcon, CollectionIcon, LogoutIcon } from '@heroicons/react/outline'

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
  }

  return (
    <nav className="fixed w-full bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Cabinet Imagerie</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/payments"
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Accueil
              </Link>
              <Link
                to="/payments/new"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                Nouveau Paiement
              </Link>
              <Link
                to="/payments"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <CollectionIcon className="h-5 w-5 mr-1" />
                Historique
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogoutIcon className="h-5 w-5 mr-1" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar