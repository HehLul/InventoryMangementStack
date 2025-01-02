import ProtectedRoute from '@/app/components/auth/ProtectedRoute'

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      {/* You can add admin navigation/header here */}
      <div className="min-h-screen bg-gray-100">
        {/* Admin header/nav */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/admin">Dashboard</a>
                <a href="/admin/inventory" className="ml-8">Inventory</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}