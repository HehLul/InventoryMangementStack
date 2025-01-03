'use client'

import { useState } from 'react'
import Image from 'next/image'
import AddVehicleModal from '@/app/components/AddVehicleModal'
import EditVehicleModal from '@/app/components/EditVehicleModal'
import { supabase } from '@/lib/supabase'

export default function DashboardClient({ initialInventory, userEmail }) {
  const [inventory, setInventory] = useState(initialInventory)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [currentVehicleImages, setCurrentVehicleImages] = useState([])

  const handleVehicleAdded = (newVehicle) => {
    setInventory([newVehicle, ...inventory])
  }

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsEditModalOpen(true)
  }

  const handleVehicleUpdated = (updatedVehicle) => {
    setInventory(inventory.map(vehicle => 
      vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
    ))
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)

      if (error) throw error

      setInventory(inventory.filter(vehicle => vehicle.id !== vehicleId))
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Failed to delete vehicle')
    }
  }

  const openImageModal = (images) => {
    setCurrentVehicleImages(images)
    setIsImageModalOpen(true)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vehicle Inventory</h1>
        <div className="text-sm text-gray-600">
          Logged in as: {userEmail}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Vehicles</h3>
          <p className="text-2xl font-bold">{inventory.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Available</h3>
          <p className="text-2xl font-bold">
            {inventory.filter(v => v.status === 'available').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Value</h3>
          <p className="text-2xl font-bold">
            ${inventory.reduce((sum, v) => sum + (v.selling_price || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vehicle List</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Vehicle
          </button>
        </div>
        
        {inventory.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <p>No vehicles in inventory</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Images</th>
                  <th className="border p-2 text-left">Vehicle</th>
                  <th className="border p-2 text-left">VIN</th>
                  <th className="border p-2 text-right">Year</th>
                  <th className="border p-2 text-right">Mileage</th>
                  <th className="border p-2 text-right">Price</th>
                  <th className="border p-2 text-center">Status</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
                        <div className="flex space-x-1">
                          {vehicle.image_urls.slice(0, 3).map((imageUrl, index) => (
                            <Image 
                              key={index}
                              src={imageUrl} 
                              alt={`Vehicle image ${index + 1}`} 
                              width={50} 
                              height={50} 
                              className="object-cover rounded cursor-pointer"
                              onClick={() => openImageModal(vehicle.image_urls)}
                            />
                          ))}
                          {vehicle.image_urls.length > 3 && (
                            <div 
                              className="w-[50px] h-[50px] bg-gray-200 rounded flex items-center justify-center cursor-pointer"
                              onClick={() => openImageModal(vehicle.image_urls)}
                            >
                              +{vehicle.image_urls.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No images</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td className="border p-2 font-mono text-sm">
                      {vehicle.vin}
                    </td>
                    <td className="border p-2 text-right">
                      {vehicle.year}
                    </td>
                    <td className="border p-2 text-right">
                      {vehicle.mileage?.toLocaleString()} mi
                    </td>
                    <td className="border p-2 text-right">
                      ${vehicle.selling_price?.toLocaleString()}
                    </td>
                    <td className="border p-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        vehicle.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="border p-2 text-center">
                      <button 
                        onClick={() => handleEditVehicle(vehicle)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Vehicle Images</h2>
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {currentVehicleImages.map((imageUrl, index) => (
                <Image 
                  key={index}
                  src={imageUrl} 
                  alt={`Vehicle image ${index + 1}`} 
                  width={300} 
                  height={300} 
                  className="object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Modals */}
      <AddVehicleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onVehicleAdded={handleVehicleAdded}
      />

      {selectedVehicle && (
        <EditVehicleModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          vehicle={selectedVehicle}
          onVehicleUpdated={handleVehicleUpdated}
        />
      )}
    </div>
  )
}