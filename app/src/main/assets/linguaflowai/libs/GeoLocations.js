export function getUserCoordinates(callback) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      callback(latitude, longitude);
    },
    () => {
      console.warn('[GEO] Standort nicht verfügbar – Koordinatenabfrage fehlgeschlagen.');
    }
  );
}