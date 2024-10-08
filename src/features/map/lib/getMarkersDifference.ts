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

  const markersToRemove = oldMakers.filter((item) => !newMakersObj[item._element.id])
  const markersToAdd = newMakers.filter((item) => !oldMakersObj[item.id])
  const markersToRemoveObg: {[key: string]: maptilersdk.Marker} = markersToRemove.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue._element.id]: currentValue,
    }),
    {},
  )

  return { markersToRemove, markersToRemoveObg, markersToAdd }
}
