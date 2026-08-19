import { AppLauncher } from '@capacitor/app-launcher';
import { Device } from '@capacitor/device';
import type { Intent } from './commandParser';

// Uses Capacitor AppLauncher to open URLs / intents / package names.
// Falls back to standard Android intent URIs when a package cannot be opened directly.

async function openUrl(url: string): Promise<void> {
  const canOpen = await AppLauncher.canOpenUrl({ url }).catch(() => ({ value: true }));
  if (!canOpen.value) {
    // Try anyway — canOpenUrl returns false for many intent:// URIs
  }
  await AppLauncher.openUrl({ url });
}

async function openPackage(pkg: string): Promise<boolean> {
  try {
    const canOpen = await AppLauncher.canOpenUrl({ url: pkg });
    if (canOpen.value) {
      await AppLauncher.openUrl({ url: pkg });
      return true;
    }
  } catch {}
  // Fallback: launch via android package intent URI
  try {
    await openUrl(`intent://#Intent;package=${pkg};end`);
    return true;
  } catch {}
  return false;
}

export const SystemAppLauncher = {
  async execute(intent: Intent): Promise<{ message: string }> {
    switch (intent.type) {
      case 'open_app': {
        const ok = await openPackage(intent.app);
        return { message: ok ? `Opening ${intent.app.split('.').pop()}, Sir.` : `I couldn't find that app installed, Sir.` };
      }

      case 'call': {
        const num = intent.contact.replace(/[^\d+]/g, '');
        if (num.length >= 3) {
          await openUrl(`tel:${num}`);
          return { message: `Dialing ${num}, Sir.` };
        }
        // Non-numeric contact name — open dialer with a search intent
        await openUrl(`intent://contacts/people/?q=${encodeURIComponent(intent.contact)}#Intent;action=android.intent.action.VIEW;end`);
        return { message: `Looking up ${intent.contact} in contacts, Sir.` };
      }

      case 'sms': {
        const num = intent.contact.replace(/[^\d+]/g, '');
        const body = intent.body ? `?body=${encodeURIComponent(intent.body)}` : '';
        if (num.length >= 3) {
          await openUrl(`sms:${num}${body}`);
          return { message: `Composing SMS to ${num}, Sir.` };
        }
        await openUrl(`sms:${body}`);
        return { message: `Opening messages, Sir.` };
      }

      case 'whatsapp': {
        // Prefer wa.me deep-link (opens WhatsApp directly if installed)
        if (intent.contact && /^\+?\d[\d ]{5,}$/.test(intent.contact)) {
          const num = intent.contact.replace(/[^\d]/g, '');
          const url = `https://wa.me/${num}${intent.body ? `?text=${encodeURIComponent(intent.body)}` : ''}`;
          await openUrl(url);
          return { message: `Opening WhatsApp for ${num}, Sir.` };
        }
        await openPackage('com.whatsapp');
        return { message: `Opening WhatsApp, Sir.` };
      }

      case 'youtube_search': {
        // Try YouTube app deep-link first, then browser fallback
        const q = encodeURIComponent(intent.query);
        try {
          await openUrl(`vnd.youtube://results?search_query=${q}`);
        } catch {
          await openUrl(`https://www.youtube.com/results?search_query=${q}`);
        }
        return { message: `Searching YouTube for ${intent.query}, Sir.` };
      }

      case 'google_search': {
        await openUrl(`https://www.google.com/search?q=${encodeURIComponent(intent.query)}`);
        return { message: `Searching Google for ${intent.query}, Sir.` };
      }

      case 'maps_search': {
        await openUrl(`geo:0,0?q=${encodeURIComponent(intent.query)}`);
        return { message: `Locating ${intent.query} on Maps, Sir.` };
      }

      case 'directions': {
        await openUrl(`google.navigation:q=${encodeURIComponent(intent.destination)}`);
        return { message: `Starting navigation to ${intent.destination}, Sir.` };
      }

      case 'camera':
        await openUrl('intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end');
        return { message: `Camera coming up, Sir.` };

      case 'gallery':
        await openUrl('content://media/internal/images/media');
        return { message: `Opening Gallery, Sir.` };

      case 'calculator':
        (await openPackage('com.android.calculator2')) || (await openPackage('com.google.android.calculator'));
        return { message: `Calculator, Sir.` };

      case 'settings':
        await openUrl('intent://#Intent;action=android.settings.SETTINGS;end');
        return { message: `Opening Settings, Sir.` };

      case 'clock':
        (await openPackage('com.android.deskclock')) || (await openPackage('com.google.android.deskclock'));
        return { message: `Clock app, Sir.` };

      case 'contacts':
        await openPackage('com.android.contacts');
        return { message: `Contacts, Sir.` };

      case 'play_music': {
        if (intent.query) {
          const q = encodeURIComponent(intent.query);
          try { await openUrl(`vnd.youtube://results?search_query=${q}`); }
          catch { await openUrl(`https://www.youtube.com/results?search_query=${q}`); }
          return { message: `Playing ${intent.query}, Sir.` };
        }
        await openPackage('com.spotify.music');
        return { message: `Starting music, Sir.` };
      }

      case 'battery': {
        const info = await Device.getBatteryInfo();
        const pct = Math.round((info.batteryLevel ?? 0) * 100);
        return { message: `Battery is at ${pct}%${info.isCharging ? ' and charging' : ''}, Sir.` };
      }

      case 'time':
        return { message: `It is ${new Date().toLocaleTimeString()}, Sir.` };

      case 'date':
        return { message: `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, Sir.` };

      case 'flashlight':
        // Flashlight requires a native plugin; instruct the user for now
        return { message: `Flashlight control needs a dedicated plugin — I have queued it for the next update, Sir.` };

      default:
        return { message: `I did not catch that, Sir.` };
    }
  }
};
