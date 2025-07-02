export interface Location {
  _id: string;
  locationName: string;
  geometry: {
    type: string;
    coordinates: any;
  };
}
