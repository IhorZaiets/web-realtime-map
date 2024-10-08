import { makeAutoObservable } from 'mobx'
import { MarkerItem } from '../types'

export class MapStore {
  mapMarkers: MarkerItem[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get getMarkers() {
    return this.mapMarkers
  }

  setMapMarkers = (value: MarkerItem[]) => {
    this.mapMarkers = value
  }
}

export const mapStore = new MapStore()
