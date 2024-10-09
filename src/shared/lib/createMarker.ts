import * as maptilersdk from '@maptiler/sdk'

export const DEFAULT_MARKER_BACKGROUND_COLOR = 'blue'
export const DELETED_MARKER_BACKGROUND_COLOR =
  'red'

export const createMarker = (
  lngLat: maptilersdk.LngLatLike,
  id: number,
  direction: number,
  ref: maptilersdk.Map,
) => {
  const el = document.createElement('div')
  el.className = 'marker'
  el.id = id.toString()
  el.style.backgroundColor = 'blue'
  el.style.backgroundRepeat = 'no-repeat'
  el.style.width = '30px'
  el.style.height = '40px'
  el.style.borderTopLeftRadius = "100px"
  el.style.borderTopRightRadius = "100px"
  el.style.backgroundSize = 'contain'

  // add marker to map
  return new maptilersdk.Marker({
    element: el,
    scale: 0.1,
    rotation: direction,
  })
    .setLngLat(lngLat)
    .addTo(ref)
}
