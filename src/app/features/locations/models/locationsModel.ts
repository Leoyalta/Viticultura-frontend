export interface LocationGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface ClientLocation {
  _id: string;
  owner: {
    _id: string;
    name: string;
    secondName: string;
    phone: string;
  };
  locationName: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationPayload {
  locationName: string;
  owner: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface LocationApiResponse {
  status: number;
  message: string;
  data: ClientLocation;
}
export interface LocationListApiResponse {
  status: number;
  message: string;
  data: ClientLocation[];
}
