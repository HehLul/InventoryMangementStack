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