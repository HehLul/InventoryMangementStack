import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Helper function to fetch inventory
export async function fetchInventory() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false }) // Sort by most recent first
    
    if (error) {
      console.error('Detailed Error fetching inventory:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      return []
    }
    
    console.log('Fetched Inventory:', data)
    return data
  }

// Helper function to add vehicle
export async function addInventoryItem(item) {
  const { data, error } = await supabase
    .from('vehicles')
    .insert(item)
    .select()
  
  if (error) {
    console.error('Error adding inventory item:', error)
    return null
  }
  
  return data[0]
}

export async function uploadVehicleImage(file, vehicleId) {
  if (!file) return null

  const fileExt = file.name.split('.').pop()
  const fileName = `${vehicleId}_${Math.random()}.${fileExt}`
  const filePath = `vehicle-images/${fileName}`

  try {
    // Convert file to Blob if it's not already
    const fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type })

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, fileBlob)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath)

    // Fetch current vehicle data
    const { data: vehicleData, error: fetchError } = await supabase
      .from('vehicles')
      .select('image_urls')
      .eq('id', vehicleId)
      .single()

    if (fetchError) throw fetchError

    // Update vehicle record with new image URL
    const currentUrls = vehicleData.image_urls || []
    const { error: updateError } = await supabase
      .from('vehicles')
      .update({ image_urls: [...currentUrls, publicUrl] })
      .eq('id', vehicleId)

    if (updateError) throw updateError

    return publicUrl
  } catch (error) {
    console.error('Image upload error:', error)
    return null
  }
}

export async function deleteVehicleImage(imageUrl, vehicleId) {
  try {
    // Remove from storage
    const fileName = imageUrl.split('/').pop()
    const { error: storageError } = await supabase.storage
      .from('vehicle-images')
      .remove([`vehicle-images/${fileName}`])

    // Remove from vehicle record
    const { error: updateError } = await supabase
      .from('vehicles')
      .update({ 
        image_urls: supabase.sql`array_remove(image_urls, ${imageUrl})` 
      })
      .eq('id', vehicleId)

    return true
  } catch (error) {
    console.error('Image deletion error:', error)
    return false
  }
}