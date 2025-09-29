export function getUserCoordinates(callback) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      callback(latitude, longitude);
    },
    () => {
      console.warn("Standort nicht verfügbar – Koordinatenabfrage fehlgeschlagen.");
    }
  );
}