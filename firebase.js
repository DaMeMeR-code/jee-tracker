// firebase.js — Firebase configuration
// Replace the values below with your own Firebase project config.
//
// HOW TO GET YOUR CONFIG:
//   1. Go to https://console.firebase.google.com
//   2. Create a new project (or use an existing one)
//   3. Go to Firestore Database → Create database (start in test mode)
//   4. Go to Project Settings → Your apps → Register a web app
//   5. Copy the firebaseConfig object values below

const FB_CONFIG = {
  apiKey: "AIzaSyCHAVIxHnyY0Or0FsGPub7jJU-OJBJ4vdI",
  authDomain: "jee-tracker-56d39.firebaseapp.com",
  projectId: "jee-tracker-56d39",
  storageBucket: "jee-tracker-56d39.firebasestorage.app",
  messagingSenderId: "989488610362",
  appId: "1:989488610362:web:93fac3a6c7e665a52ec903",
  measurementId: "G-1RB3HZ2GJY",
};

// ── Firestore REST helpers (no SDK needed) ──────────────────────────────────
function firestoreUrl(code) {
  return `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/trackers/${encodeURIComponent(code)}?key=${FB_CONFIG.apiKey}`;
}

async function fsLoad(code) {
  try {
    const r = await fetch(firestoreUrl(code));
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.fields) return null;
    return {
      CKS:  d.fields.CKS  ? JSON.parse(d.fields.CKS.stringValue)  : {},
      TPS:  d.fields.TPS  ? JSON.parse(d.fields.TPS.stringValue)  : {},
      DUES: d.fields.DUES ? JSON.parse(d.fields.DUES.stringValue) : {},
    };
  } catch { return null; }
}

async function fsSave(code, CKS, TPS, DUES, onStatus) {
  try {
    onStatus('saving', '\u27f3 Saving\u2026');
    const body = {
      fields: {
        CKS:  { stringValue: JSON.stringify(CKS)  },
        TPS:  { stringValue: JSON.stringify(TPS)  },
        DUES: { stringValue: JSON.stringify(DUES) },
      }
    };
    const url = firestoreUrl(code)
      + '&updateMask.fieldPaths=CKS'
      + '&updateMask.fieldPaths=TPS'
      + '&updateMask.fieldPaths=DUES';
    const r = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (r.ok) { onStatus('saved', '\u2713 Saved'); setTimeout(() => onStatus('', ''), 2000); }
    else onStatus('err', '\u2717 Save failed');
  } catch { onStatus('err', '\u2717 Offline'); }
}
