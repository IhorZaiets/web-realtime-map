import { Map } from '@/features'
import { MarkerItem, socket } from '@/shared'
import { mapStore } from '@/shared/store/mapStore'
import { useEffect } from 'react'

const MapPage = () => {
  const handleReceiveMapItems = (value: MarkerItem[]) => {
    mapStore.setMapMarkers(value)
  }

  useEffect(() => {
    socket.on('map_items', handleReceiveMapItems)

    return () => {
      socket.off('map_items')
    }
  }, [])

  return <Map mapStore={mapStore} />
}

export default MapPage
