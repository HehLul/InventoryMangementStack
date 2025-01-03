'use client'

import { useState, useEffect } from 'react'
import { supabase, uploadVehicleImage, deleteVehicleImage } from '@/lib/supabase'
import Image from 'next/image'

export default function EditVehicleModal({ 
  isOpen, 
  onClose, 
  vehicle, 
  onVehicleUpdated 
}) {
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    color: '',
    mileage: '',
    selling_price: '',
    status: 'available',
    image_urls: []
  })
  
  const [newImages, setNewImages] = useState([])

  // Populate form when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      setVehicleData({
        ...vehicle,
        year: vehicle.year ? vehicle.year.toString() : '',
        mileage: vehicle.mileage ? vehicle.mileage.toString() : '',
        selling_price: vehicle.selling_price ? vehicle.selling_price.toString() : '',
        image_urls: vehicle.image_urls || []
      })
      // Reset new images when vehicle changes
      setNewImages([])
    }
  }, [vehicle])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setNewImages([...newImages, ...files])
  }

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index)
    setNewImages(updatedNewImages)
  }

  const handleRemoveExistingImage = async (imageUrl) => {
    try {
      const success = await deleteVehicleImage(imageUrl, vehicle.id)
      if (success) {
        setVehicleData(prev => ({
          ...prev,
          image_urls: prev.image_urls.filter(url => url !== imageUrl)
        }))
      }
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!vehicleData.vin || !vehicleData.make || !vehicleData.model) {
      alert('Please fill in required fields')
      return
    }

    try {
      // Update vehicle details
      const { data: vehicleUpdateData, error: vehicleUpdateError } = await supabase
        .from('vehicles')
        .update({
          ...vehicleData,
          year: parseInt(vehicleData.year),
          mileage: parseInt(vehicleData.mileage),
          selling_price: parseFloat(vehicleData.selling_price)
        })
        .eq('id', vehicle.id)
        .select()

      if (vehicleUpdateError) throw vehicleUpdateError

      // Upload new images
      const newImageUrls = await Promise.all(
        newImages.map(file => uploadVehicleImage(file, vehicle.id))
      )

      // Combine existing and new image URLs
      const updatedVehicle = {
        ...vehicleUpdateData[0],
        image_urls: [...vehicleData.image_urls, ...newImageUrls.filter(url => url)]
      }

      onVehicleUpdated(updatedVehicle)
      onClose()
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Failed to update vehicle')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
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
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Selling Price"
              value={vehicleData.selling_price}
              onChange={(e) => setVehicleData({...vehicleData, selling_price: e.target.value})}
              className="w-full p-2 border rounded"
              step="0.01"
            />
            <select
              value={vehicleData.status}
              onChange={(e) => setVehicleData({...vehicleData, status: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {/* Image Upload and Preview Section */}
          <div>
            <label className="block mb-2">Vehicle Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
            
            {/* Existing Images */}
            <div className="flex flex-wrap mt-2 gap-2">
              {vehicleData.image_urls.map((imageUrl, index) => (
                <div key={imageUrl} className="relative">
                  <Image 
                    src={imageUrl} 
                    alt={`Existing vehicle image ${index + 1}`} 
                    width={100} 
                    height={100} 
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(imageUrl)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}

              {/* New Images Preview */}
              {newImages.map((image, index) => (
                <div key={`new-${index}`} className="relative">
                  <Image 
                    src={URL.createObjectURL(image)} 
                    alt={`New vehicle image ${index + 1}`} 
                    width={100} 
                    height={100} 
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

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
              Update Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}