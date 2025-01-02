export default function Dashboard() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Inventory</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Available Vehicles</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Sold This Month</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    )
  }