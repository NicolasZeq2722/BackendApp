import { Platform } from 'react-native';

// --- POLYFILL SALVAVIDAS ---
if (Platform.OS !== 'web') {
  try {
    const genericEvent = Event as any;
    if (typeof genericEvent !== 'undefined' && typeof genericEvent.NONE === 'undefined') {
        genericEvent.NONE = 0;
    }
    if (typeof Event !== 'undefined') {
        const descriptor = Object.getOwnPropertyDescriptor(Event, 'NONE');
        if (!descriptor || !descriptor.writable) {
            Object.defineProperty(Event, 'NONE', {
                value: 0,
                writable: false,
                configurable: true
            });
        }
    }
  } catch (e) { console.log("Polyfill error:", e); }
}
// --- FIN POLYFILL ---

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
