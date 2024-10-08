import * as maptilersdk from '@maptiler/sdk'

export const createMarker = (
  lngLat: maptilersdk.LngLatLike,
  id: number,
  direction: number,
  ref: maptilersdk.Map,
) => {
  const el = document.createElement('div')
  el.className = 'marker'
  el.id = id.toString()
  el.style.backgroundImage = 'url(src/app/assets/images/arrow.png)'
  el.style.backgroundRepeat = 'no-repeat'
  el.style.width = '30px'
  el.style.height = '30px'
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
