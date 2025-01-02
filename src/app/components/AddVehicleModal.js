// src/app/components/AddVehicleModal.js
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddVehicleModal({ isOpen, onClose, onVehicleAdded }) {
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    color: '',
    mileage: '',
    selling_price: '',
    status: 'available'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!vehicleData.vin || !vehicleData.make || !vehicleData.model) {
      alert('Please fill in required fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          year: parseInt(vehicleData.year),
          mileage: parseInt(vehicleData.mileage),
          selling_price: parseFloat(vehicleData.selling_price)
        })
        .select()

      if (error) throw error

      onVehicleAdded(data[0])
      onClose()
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="VIN"
            value={vehicleData.vin}
            onChange={(e) => setVehicleData({...vehicleData, vin: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Make"
              value={vehicleData.make}
              onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Model"
              value={vehicleData.model}
              onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Year"
              value={vehicleData.year}
              onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Color"
              value={vehicleData.color}
              onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Mileage"
              value={vehicleData.mileage}
              onChange={(e) => setVehicleData({...vehicleData, mileage: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <input
            type="number"
            placeholder="Selling Price"
            value={vehicleData.selling_price}
            onChange={(e) => setVehicleData({...vehicleData, selling_price: e.target.value})}
            className="w-full p-2 border rounded"
            step="0.01"
          />
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}