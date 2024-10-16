import { socket } from '@/shared'
import {
  createMarker,
  DEFAULT_MARKER_BACKGROUND_COLOR,
  DELETED_MARKER_BACKGROUND_COLOR,
} from '@/shared/lib/createMarker'
import { mapStore } from '@/shared/store/mapStore'
import { SESSION_STORAGE } from '@/shared/types/storage'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import { observer } from 'mobx-react'
import { FC, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMarkersDifference } from '../lib/getMarkersDifference'
import './map.css'

const INITIAL_POSITION = { lng: 139.793, lat: 35.6844 }
const INITIAL_ZOOM = 13

const NUMBER_OF_MINUTES_TO_REMOVE = 5
const MINUTE_IN_MILISECONDS = 60000

type Props = {
  mapStore: typeof mapStore
}

const Map: FC<Props> = observer(({ mapStore }) => {
  const navigate = useNavigate()

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const markers = useRef<maptilersdk.Marker[] | null>(null)
  const removingMarkersTimeoutsIds = useRef<{ [markerId: string]: string }>({})

  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY

  // initialising map
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem(SESSION_STORAGE.IS_LOGGED_IN)

    if (!isLoggedIn) {
      navigate('/')
      return
    }

    if (map.current) {
      return
    } // stops map from intializing more than once
    socket.connect()

    map.current = new maptilersdk.Map({
      container: mapContainer.current as HTMLDivElement,
      style: maptilersdk.MapStyle.STREETS,
      center: [INITIAL_POSITION.lng, INITIAL_POSITION.lat],
      zoom: INITIAL_ZOOM,
    })
  }, [navigate])

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

    const { markersToAdd, markersToRemove, markersToStay, newMakersObj } =
      getMarkersDifference(markers.current, mapStore.mapMarkers)

    // deleting markers
    markersToRemove.map(
      (item) =>
        (item._element.style.backgroundColor = DELETED_MARKER_BACKGROUND_COLOR),
    )
    // we save timer ids in order to cancel timer if in next request we receive this marker
    const newRemovingMarkersTimeoutsIds = markersToRemove.reduce(
      (previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue._element.id]: setTimeout(() => {
            // clearing marker from all possible places
            currentValue.remove()
            delete removingMarkersTimeoutsIds.current[currentValue._element.id]
            markers.current = (markers.current || []).filter(
              (i) => i._element.id !== currentValue._element.id,
            )
          }, NUMBER_OF_MINUTES_TO_REMOVE * MINUTE_IN_MILISECONDS),
        }
      },
      {},
    )
    removingMarkersTimeoutsIds.current = {
      ...removingMarkersTimeoutsIds.current,
      ...newRemovingMarkersTimeoutsIds,
    }

    markersToStay.forEach((item) => {
      // moving our markers
      item.setLngLat([
        newMakersObj[item._element.id].coords.lng,
        newMakersObj[item._element.id].coords.lat,
      ])

      // make sure that we will not delete markers that we received from BE
      item._element.style.backgroundColor = DEFAULT_MARKER_BACKGROUND_COLOR
      clearTimeout(removingMarkersTimeoutsIds.current[item._element.id])
      delete removingMarkersTimeoutsIds.current[item._element.id]
    })

    // adding new markers to the map
    const newMarkers = markersToAdd.map((item) =>
      createMarker(
        [item.coords.lng, item.coords.lat],
        item.id,
        item.direction,
        map.current!,
      ),
    )

    markers.current = [...markers.current, ...newMarkers]
  }, [mapStore.mapMarkers, navigate])

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  )
})

export default Map
