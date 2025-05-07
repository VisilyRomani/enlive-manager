export function loadGoogleMaps(apiKey: string) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
        }

        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.google.maps));
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(window.google.maps);
        script.onerror = reject;

        document.body.appendChild(script);
    });
}
