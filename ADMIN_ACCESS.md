# Private dashboard access

Configure `GSC_DASHBOARD_PASSWORD` as a secret distinct from `ADMIN_TOKEN`.
Open `/gsc` (or `/GSC`) or `/dummy` and use username `admin` and that
password in the browser's sign-in prompt. The username is only a label; the
server checks the password. A successful login creates an HttpOnly, SameSite
session cookie valid for eight hours. The dashboard's `/api/gsc/*` requests
use that session. Cookie-authenticated writes additionally require the site's
own `Origin` header. A missing dashboard password or `SESSION_SECRET` fails
closed; no password is embedded in client-side code.

Server integrations can instead send `ADMIN_TOKEN` as `x-api-key` or a Bearer
header to `/api/gsc/*` and `/api/test-mcb`. Keep this admin credential out of
browser code and out of URLs. The scheduled GSC sync calls the internal
function directly and does not need an HTTP token.

The Indra integration has a separate `INDRA_API_TOKEN` for `/api/indra/*`
(header only). During migration, the admin token remains accepted there and
legacy admin-token query URLs work only on Indra and RPS export routes. Once
external callers have migrated, remove those compatibility paths.