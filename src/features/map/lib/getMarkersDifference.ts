import { MarkerItem } from '@/shared'
import * as maptilersdk from '@maptiler/sdk'

export const getMarkersDifference = (
  oldMakers: maptilersdk.Marker[],
  newMakers: MarkerItem[],
) => {
  const oldMakersObj: { [key: string]: maptilersdk.Marker } = oldMakers.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue._element.id]: currentValue,
    }),
    {},
  )
  const newMakersObj: { [key: string]: MarkerItem } = newMakers.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.id]: currentValue,
    }),
    {},
  )

  // this array contains markers that we do not have in received request and we need to remove
  const markersToRemove = oldMakers.filter(
    (item) => !newMakersObj[item._element.id],
  )
  // this array contains markers that we do not have in our map and need to add
  const markersToAdd = newMakers.filter((item) => !oldMakersObj[item.id])
  // this array contains markers that we need to leave on map
  // (in case we marked them as deleted, we need to leave them as default)
  const markersToStay = oldMakers.filter(
    (item) => newMakersObj[item._element.id],
  )

  return { markersToRemove, markersToAdd, markersToStay }
}
