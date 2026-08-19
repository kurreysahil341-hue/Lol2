// Rule-based parser turns natural-language commands (Hindi/Hinglish/English)
// into a structured intent that SystemAppLauncher can execute.

export type Intent =
  | { type: 'open_app'; app: string }
  | { type: 'call'; contact: string }
  | { type: 'sms'; contact: string; body?: string }
  | { type: 'whatsapp'; contact?: string; body?: string }
  | { type: 'youtube_search'; query: string }
  | { type: 'google_search'; query: string }
  | { type: 'maps_search'; query: string }
  | { type: 'directions'; destination: string }
  | { type: 'set_alarm'; time: string }
  | { type: 'set_timer'; seconds: number }
  | { type: 'flashlight'; on: boolean }
  | { type: 'wifi' | 'bluetooth' | 'settings' | 'camera' | 'gallery' | 'calculator' | 'clock' | 'contacts' }
  | { type: 'play_music'; query?: string }
  | { type: 'battery' }
  | { type: 'time' | 'date' };

const APP_ALIASES: Record<string, string> = {
  whatsapp: 'com.whatsapp',
  'whats app': 'com.whatsapp',
  youtube: 'com.google.android.youtube',
  'you tube': 'com.google.android.youtube',
  chrome: 'com.android.chrome',
  gmail: 'com.google.android.gm',
  maps: 'com.google.android.apps.maps',
  'google maps': 'com.google.android.apps.maps',
  instagram: 'com.instagram.android',
  facebook: 'com.facebook.katana',
  twitter: 'com.twitter.android',
  x: 'com.twitter.android',
  telegram: 'org.telegram.messenger',
  spotify: 'com.spotify.music',
  netflix: 'com.netflix.mediaclient',
  camera: 'com.android.camera',
  calculator: 'com.android.calculator2',
  settings: 'com.android.settings',
  contacts: 'com.android.contacts',
  clock: 'com.android.deskclock',
  gallery: 'com.android.gallery3d',
  phone: 'com.android.dialer',
  messages: 'com.android.mms',
  playstore: 'com.android.vending',
  'play store': 'com.android.vending'
};

function stripPrefixes(t: string): string {
  return t
    .toLowerCase()
    .replace(/\b(jarvis|hey jarvis|ok jarvis|please|zara|abhi|मुझे|मेरे लिए)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const CommandParser = {
  parse(raw: string): Intent | null {
    const t = stripPrefixes(raw);

    // --- battery / time / date ---
    if (/(battery|बैटरी).*(kitni|percent|status|level|कितनी)/.test(t) || /battery status/.test(t)) return { type: 'battery' };
    if (/^(what.?s the time|time kya|kitne baje|समय|टाइम)/.test(t)) return { type: 'time' };
    if (/^(what.?s the date|date kya|आज कौन|तारीख)/.test(t)) return { type: 'date' };

    // --- flashlight / torch ---
    if (/(flash ?light|torch|टॉर्च).*(on|chalu|jala)/.test(t)) return { type: 'flashlight', on: true };
    if (/(flash ?light|torch|टॉर्च).*(off|bandh|band|bujha)/.test(t)) return { type: 'flashlight', on: false };

    // --- call ---
    let m = t.match(/\b(?:call|phone|dial|फोन|कॉल)\s+(?:kar[oe]?|to)?\s*([a-z\u0900-\u097F ]{2,40})/);
    if (m) return { type: 'call', contact: m[1].trim() };

    // --- SMS ---
    m = t.match(/\b(?:sms|message|msg|मैसेज)\s+(?:send)?\s*(?:to|ko)?\s*([a-z\u0900-\u097F ]{2,40})(?:\s+(?:that|kaho|bolo|:)\s+(.*))?/);
    if (m) return { type: 'sms', contact: m[1].trim(), body: m[2]?.trim() };

    // --- WhatsApp with contact ---
    m = t.match(/whats ?app\s+(?:message|msg)?\s*(?:to|ko)\s+([a-z\u0900-\u097F ]{2,40})(?:\s+(?:that|kaho|bolo|:)\s+(.*))?/);
    if (m) return { type: 'whatsapp', contact: m[1].trim(), body: m[2]?.trim() };
    if (/whats ?app.*(kholo|open|chalu)/.test(t) || /open whats ?app/.test(t)) return { type: 'open_app', app: 'com.whatsapp' };

    // --- YouTube search ---
    m = t.match(/youtube.*(?:par|pe|on)?\s*(?:search|play|chala[oe]?|dikha[oe]?|find)\s+(.+)/);
    if (m) return { type: 'youtube_search', query: m[1].trim() };
    m = t.match(/(?:play|chala[oe]?)\s+(.+?)\s+(?:on\s+)?youtube/);
    if (m) return { type: 'youtube_search', query: m[1].trim() };

    // --- Google search ---
    m = t.match(/(?:google|search|khoj[oe]?)\s+(?:kar[oe]?|for|par)?\s*(.+)/);
    if (m && !/youtube|map/.test(m[1])) return { type: 'google_search', query: m[1].trim() };

    // --- Maps / directions ---
    m = t.match(/(?:direction|raasta|rasta|way|navigate).*(?:to|tak|for)\s+(.+)/);
    if (m) return { type: 'directions', destination: m[1].trim() };
    m = t.match(/(?:map|maps).*(?:show|dikha[oe]?|find|search|par)\s+(.+)/);
    if (m) return { type: 'maps_search', query: m[1].trim() };

    // --- generic open app ---
    m = t.match(/(?:open|kholo|chalu\s+karo|launch|start)\s+([a-z ]{2,30})/);
    if (m) {
      const app = m[1].trim();
      const pkg = APP_ALIASES[app] || APP_ALIASES[app.replace(/\s+/g, '')];
      if (pkg) return { type: 'open_app', app: pkg };
    }
    m = t.match(/([a-z ]{2,30})\s+(?:kholo|open|chalu\s+karo|launch)/);
    if (m) {
      const app = m[1].trim();
      const pkg = APP_ALIASES[app] || APP_ALIASES[app.replace(/\s+/g, '')];
      if (pkg) return { type: 'open_app', app: pkg };
    }

    // --- shortcut apps ---
    if (/\b(camera|कैमरा)\b/.test(t) && /(open|kholo|chalu|start)/.test(t)) return { type: 'camera' };
    if (/\b(calculator|कैलकुलेटर)\b/.test(t)) return { type: 'calculator' };
    if (/\b(gallery|photos|तस्वीर)\b/.test(t) && /(open|kholo|dikha)/.test(t)) return { type: 'gallery' };
    if (/\b(settings|सेटिंग)\b/.test(t)) return { type: 'settings' };
    if (/\b(clock|alarm|घड़ी)\b/.test(t)) return { type: 'clock' };
    if (/\b(contacts|संपर्क)\b/.test(t) && /(open|kholo)/.test(t)) return { type: 'contacts' };

    // --- play music (generic) ---
    m = t.match(/(?:play|chala[oe]?)\s+(?:music|song|gaana|गाना)\s*(.*)/);
    if (m) return { type: 'play_music', query: m[1]?.trim() || undefined };

    return null;
  }
};
