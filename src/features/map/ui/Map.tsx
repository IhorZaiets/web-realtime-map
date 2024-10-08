import { createMarker } from '@/shared/lib/createMarker'
import { mapStore } from '@/shared/store/mapStore'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import { observer } from 'mobx-react'
import { FC, useEffect, useRef } from 'react'
import { getMarkersDifference } from '../lib/getMarkersDifference'
import './map.css'

const INITIAL_POSITION = { lng: 139.753, lat: 35.6844 }
const INITIAL_ZOOM = 14

type Props = {
  mapStore: typeof mapStore
}

const Map: FC<Props> = observer(({ mapStore }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const markers = useRef<maptilersdk.Marker[] | null>(null)

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY

  useEffect(() => {
    if (map.current) {
      return
    } // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current as HTMLDivElement,
      style: maptilersdk.MapStyle.STREETS,
      center: [INITIAL_POSITION.lng, INITIAL_POSITION.lat],
      zoom: INITIAL_ZOOM,
    })
  }, [])

  useEffect(() => {
    if (!map.current) {
      return
    }

    if (!markers.current?.length) {
      markers.current = mapStore.mapMarkers.map((item) =>
        createMarker(
          [item.coords.lng, item.coords.lat],
          item.id,
          item.direction,
          map.current!,
        ),
      )

      return
    }

    const { markersToAdd, markersToRemove, markersToRemoveObg } =
      getMarkersDifference(markers.current, mapStore.mapMarkers)

    markersToRemove.map(
      (item) =>
        (item._element.style.backgroundImage =
          'url(src/app/assets/images/arrowMissing.png)'),
    )
    setTimeout(() => {
      markersToRemove.map((item) => item.remove())
      markers.current = (markers.current || []).filter(
        (item) => !markersToRemoveObg[item._element.id],
      )
    }, 500)

    const newMarkers = markersToAdd.map((item) =>
      createMarker(
        [item.coords.lng, item.coords.lat],
        item.id,
        item.direction,
        map.current!,
      ),
    )

    markers.current = [...markers.current, ...newMarkers]
  }, [mapStore.mapMarkers])

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  )
})

export default Map
