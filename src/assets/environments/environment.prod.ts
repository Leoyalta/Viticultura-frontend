declare global {
  interface Window {
    env: { [key: string]: string };
  }
}

export const environment = {
  production: true,
  mapboxToken: window.env?.['MAPBOX_TOKEN'] || '',
};
// mapboxToken:
//   'sk.eyJ1IjoibGVveWFsdGEiLCJhIjoiY21jbHc1NTY4MGNiYzJycjBkOTd2MWJlNCJ9.lZCCXUrjBnZ98EazDRLYkA',
