# Multivendors Frontend

This frontend integrates with the `MultivendorsBackend` API to provide:
- English / Arabic (RTL) support via i18next
- Tailwind CSS-based styling
- Auth (register/login/profile) with token persistence
- Real-time chat with vendors (socket.io-client)
- AI Assistant (calls /api/ai on the backend)

Quick start:
1. Copy `.env.example` to `.env` and set `VITE_API_URL` and `VITE_SOCKET_URL`.
2. Install: `npm install`
3. Run: `npm run dev`

You must have the backend running (see MultivendorsBackend README). The frontend expects:
- /api/user/register
- /api/user/login
- /api/user/profile
- /api/vendor/me
- /api/vendor/:id (PUT to set autoResponse)
- /api/chat/history/me
- Socket.IO on same origin as VITE_SOCKET_URL
- /api/ai (OpenAI proxy)
