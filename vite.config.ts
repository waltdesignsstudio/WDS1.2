import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// Backend API plugin for secure Employee ID (WDS-XXXX) lookup
function employeeLookupApiPlugin(): Plugin {
  return {
    name: 'employee-lookup-api',
    configureServer(server) {
      server.middlewares.use('/api/lookup-employee', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const rawId = (parsed.employeeId || '').toString().trim();
              if (!rawId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Employee ID is required.' }));
                return;
              }

              const cleanUpper = rawId.toUpperCase().replace(/\s+/g, '');
              const formattedId = cleanUpper.startsWith('WDS-') ? cleanUpper : `WDS-${cleanUpper}`;

              // 1. Query Firestore REST API for wds_lookup/{formattedId}
              const projectId = 'waltdesignsstudio-84b20';
              const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/wds_lookup/${encodeURIComponent(formattedId)}`;
              
              const docResp = await fetch(docUrl);
              if (docResp.ok) {
                const docData = await docResp.json();
                const email = docData?.fields?.email?.stringValue;
                if (email) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, email: email.toLowerCase() }));
                  return;
                }
              }

              // 2. Query Firestore runQuery on users collection for corporateUserId == formattedId
              const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
              const qResp = await fetch(queryUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  structuredQuery: {
                    from: [{ collectionId: 'users' }],
                    where: {
                      fieldFilter: {
                        field: { fieldPath: 'corporateUserId' },
                        op: 'EQUAL',
                        value: { stringValue: formattedId },
                      },
                    },
                    limit: 1,
                  },
                }),
              });

              if (qResp.ok) {
                const results = await qResp.json();
                if (Array.isArray(results) && results.length > 0 && results[0]?.document?.fields?.email?.stringValue) {
                  const email = results[0].document.fields.email.stringValue;
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, email: email.toLowerCase() }));
                  return;
                }
              }

              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: `Employee ID "${formattedId}" was not found.` }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server lookup error.' }));
            }
          });
        } else {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), employeeLookupApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          services: path.resolve(__dirname, 'services.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          dashboard: path.resolve(__dirname, 'dashboard.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
