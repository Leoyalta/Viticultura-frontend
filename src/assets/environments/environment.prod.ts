declare global {
  interface Window {
    env: { [key: string]: string };
  }
}

export const environment = {
  production: true,
  mapboxToken: window.env?.['MAPBOX_TOKEN'] || '',
};
