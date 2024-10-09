import { Map } from '@/features'
import { MarkerItem, socket, SOCKET_EVENTS } from '@/shared'
import { mapStore } from '@/shared/store/mapStore'
import { useEffect } from 'react'

const MapPage = () => {
  const handleReceiveMapItems = (value: MarkerItem[]) => {
    mapStore.setMapMarkers(value)
  }

  useEffect(() => {
    socket.on(SOCKET_EVENTS.MAP_ITEMS, handleReceiveMapItems)

    return () => {
      socket.off(SOCKET_EVENTS.MAP_ITEMS)
    }
  }, [])

  return <Map mapStore={mapStore} />
}

export default MapPage
