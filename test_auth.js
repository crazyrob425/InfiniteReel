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
      timeout: 2000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function run() {
  console.log("Fetching access token from metadata server...");
  const tokenRes = await getMetadata('/computeMetadata/v1/instance/service-accounts/default/token');
  console.log("Access token status:", tokenRes.status);
  
  let accessToken = '';
  if (tokenRes.status === 200) {
    try {
      const parsed = JSON.parse(tokenRes.data);
      accessToken = parsed.access_token;
      console.log("AccessToken length:", accessToken.length);
    } catch(e) {
      console.log("Failed to parse access token:", e.message);
    }
  }

  console.log("Fetching id token from metadata server...");
  const idTokenRes = await getMetadata('/computeMetadata/v1/instance/service-accounts/default/identity?audience=http://localhost:8000');
  console.log("ID Token status:", idTokenRes.status);
  const idToken = idTokenRes.data ? idTokenRes.data.trim() : '';
  console.log("ID Token length:", idToken.length);

  if (accessToken) {
    console.log("Trying /sync with Bearer accessToken...");
    const resSyncAcc = await callControlPlane('/sync', `Bearer ${accessToken}`);
    console.log("Sync Response:", resSyncAcc.status, resSyncAcc.data);

    console.log("Trying /files with Bearer accessToken...");
    const resFilesAcc = await callControlPlane('/files', `Bearer ${accessToken}`);
    console.log("Files Response:", resFilesAcc.status, resFilesAcc.data.slice(0, 300));
  }

  if (idToken) {
    console.log("Trying /sync with Bearer idToken...");
    const resSyncId = await callControlPlane('/sync', `Bearer ${idToken}`);
    console.log("Sync Response:", resSyncId.status, resSyncId.data);

    console.log("Trying /files with Bearer idToken...");
    const resFilesId = await callControlPlane('/files', `Bearer ${idToken}`);
    console.log("Files Response:", resFilesId.status, resFilesId.data.slice(0, 300));
  }
}

run();
