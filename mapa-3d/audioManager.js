// audioManager.js

export const audioTracks = {
    'América del Norte': 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf7f6.mp3?filename=lofi-study-112191.mp3',
    'América del Sur': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_12a7a40ca7.mp3?filename=chill-lofi-song-8444.mp3',
    'Europa': 'https://cdn.pixabay.com/download/audio/2022/04/18/audio_e69197a177.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    'África': 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c2730ebb.mp3?filename=good-night-109430.mp3',
    'Asia': 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_73da59fdfb.mp3?filename=japanese-lofi-111161.mp3',
    'Oceanía': 'https://cdn.pixabay.com/download/audio/2022/11/17/audio_de26917c67.mp3?filename=chill-acoustic-guitar-125027.mp3',
    'Océano': 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_dbddf01b3b.mp3?filename=ambient-space-111003.mp3'
};

const players = {};
let currentContinent = null;

// Precargar los elementos de audio
export function initAudio() {
    for (const [continent, url] of Object.entries(audioTracks)) {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0;
        players[continent] = audio;
    }
}

export function playContinent(continent) {
    if (continent === currentContinent) return;

    const prev = players[currentContinent];
    const next = players[continent];

    if (prev) fadeAudio(prev, 0, 1000); // 1 segundo fade out
    if (next) {
        next.play().catch(e => console.warn("Esperando interacción para audio", e));
        fadeAudio(next, 0.5, 1000); // 1 segundo fade in a 50% de volumen
    }

    currentContinent = continent;
}

function fadeAudio(audio, targetVolume, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    const volStep = (targetVolume - audio.volume) / steps;

    let currentStep = 0;
    if (audio.fadeInterval) clearInterval(audio.fadeInterval);

    audio.fadeInterval = setInterval(() => {
        currentStep++;
        let newVol = audio.volume + volStep;
        if (newVol > 1) newVol = 1;
        if (newVol < 0) newVol = 0;
        audio.volume = newVol;

        if (currentStep >= steps) {
            clearInterval(audio.fadeInterval);
            audio.volume = targetVolume;
            if (targetVolume === 0) audio.pause();
        }
    }, stepTime);
}

// Lógica de detección simple de continentes a partir de coordenadas lat y lon
export function getContinent(lat, lon) {
    if (lat > 15 && lon < -50 && lon > -170) return 'América del Norte';
    if (lat >= -55 && lat <= 15 && lon < -35 && lon > -90) return 'América del Sur';
    if (lat > 35 && lon >= -10 && lon < 40) return 'Europa';
    if (lat >= -35 && lat <= 35 && lon >= -20 && lon < 50) return 'África';
    if (lat > 5 && lon >= 40 && lon <= 180) return 'Asia';
    if (lat >= -50 && lat <= 5 && lon >= 110 && lon <= 180) return 'Oceanía';
    return 'Océano';
}
