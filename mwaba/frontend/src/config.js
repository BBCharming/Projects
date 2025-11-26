// Frontend configuration
export const API_BASE_URL = 'http://localhost:3000';
export const WS_BASE_URL = 'ws://localhost:3000';

// App settings
export const APP_CONFIG = {
    name: 'Mwaba AI Assistant',
    version: '1.0.0',
    wakeWords: ['Hey Mwaba', 'Mwaba', 'Hello Mwaba'],
    defaultVoice: {
        rate: 0.9,
        pitch: 1.1,
        volume: 1
    }
};

export default APP_CONFIG;
