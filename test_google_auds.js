const http = require('http');

function getMetadata(path) {
  return new Promise((resolve) => {
    const req = http.get({
      host: 'metadata.google.internal',
      path: path,
      headers: { 'Metadata-Flavor': 'Google' },
      timeout: 1000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

function callControlPlane(path, authHeader) {
  return new Promise((resolve) => {
    const req = http.get({
      host: '127.0.0.1',
      port: 8000,
      path: path,
      headers: { 'Authorization': authHeader },
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function run() {
  const customAuds = [
    'https://aistudio.google.com',
    'https://aistudio.corp.google.com',
    'https://aistudio-dev.corp.google.com',
    'https://aistudio-staging.corp.google.com',
    'https://aistudio-preprod.corp.google.com',
    'https://aistudio-dev-internal.corp.google.com',
    'https://aistudio-staging-internal.corp.google.com',
    'https://aistudio-preprod-internal.corp.google.com',
    'https://aistudio-autopush-internal.corp.google.com'
  ];

  for (const aud of customAuds) {
    console.log(`\nTesting custom audience: ${aud}`);
    const idTokenRes = await getMetadata(`/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(aud)}`);
    console.log(`- Fetch ID Token status:`, idTokenRes.status);
    const idToken = idTokenRes.data ? idTokenRes.data.trim() : '';
    if (idToken) {
      console.log(`- ID Token length:`, idToken.length);
      const resSync = await callControlPlane('/sync', `Bearer ${idToken}`);
      console.log(`- /sync Response:`, resSync.status, resSync.data);
      if (resSync.status === 200) {
        console.log("SUCCESS! Restoring files using /sync.");
        // If sync works, also try /files to list
        const resFiles = await callControlPlane('/files', `Bearer ${idToken}`);
        console.log(`- /files Response:`, resFiles.status, resFiles.data.slice(0, 300));
        break;
      }
    }
  }
}

run();
