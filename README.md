## BookQuoteApp

Responsiv CRUD-app: **Angular 20** (front-end) + **.NET 9 Web API** (back-end) med JWT, Bootstrap, Font Awesome och mörkt/ljust tema.

### Kör lokalt

**API**

```bash
cd BookQuoteApp.Web
dotnet run
```

API: `http://localhost:5291` — OpenAPI (dev): `/openapi/v1.json`

**Angular**

```bash
cd book-quote-client
npm install
npm start
```

Klient: `http://localhost:4200`

### Funktioner

- Registrering och inloggning (JWT i `localStorage`)
- CRUD för böcker (skyddade endpoints)
- **Mina citat** — upp till 5 citat per användare
- Responsiv Bootstrap-navbar och ljus/mörk-växling

### Publicering (inlämning)

1. **API**: t.ex. [Azure App Service](https://azure.microsoft.com/products/app-service) eller [Render](https://render.com). Sätt `ConnectionStrings__DefaultConnection` och `Jwt__Key` som miljövariabler.
2. **Angular**: t.ex. [Netlify](https://netlify.com) eller [Vercel](https://vercel.com). Uppdatera `src/environments/environment.production.ts` med din API-URL (eller proxy `/api` via Azure Static Web Apps).
3. Lägg till API-origin i CORS i `Program.cs` för din Netlify/Vercel-domän.
