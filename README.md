# Twilio Video Chat

A real-time video calling app built with React and the Twilio Video SDK.

## Getting started

**Install dependencies**

```bash
pnpm i
```

**Create a `.env.local` file** in the project root:

```bash
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_API_SECRET=your_api_secret
```

You can find these in the [Twilio Console](https://console.twilio.com). The API key and secret are created under **Account → API keys & tokens**.

**Start the dev server**

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173), enter your name and a room name, and join.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm test` | Run tests |
| `pnpm lint` | Run ESLint |

## Features

- Join any named room with a display name
- Dominant speaker is shown in the main tile; others appear as thumbnails
- Mute/unmute audio and video
- Background blur
- Raise hand to signal you want to speak
- Leave and return to the lobby

## Time spent

3–4 hours.

## What I'd add with more time

- **More extensions** — screen sharing, audio level indicators, camera/mic switching
- **Hook-level tests** — the custom Twilio hooks (`useRoom`, `useLocalTracks`, etc.) are currently only covered indirectly through component tests; dedicated unit tests with a mocked SDK would give tighter coverage
- **Dark mode** — the design system is set up for it (CSS variables via Tailwind), it just needs a theme toggle

## Technical choices

**Vite over a full framework** — Next.js or Remix would be overkill for a single-page app with no server-side rendering requirements. Vite gives fast HMR and a minimal build setup without the overhead.

**Hooks for SDK integration** — all Twilio SDK interactions live in dedicated hooks (`useRoom`, `useLocalTracks`, `useParticipants`, etc.). This keeps components declarative and makes the SDK behaviour independently testable.

**`useSyncExternalStore` for Twilio events** — rather than subscribing to SDK events inside `useEffect` and copying state, the hooks that track participants and publications use `useSyncExternalStore`. This is the correct React 18 primitive for subscribing to external event sources and avoids a class of stale-state bugs.

**React Compiler** — enabled via `babel-plugin-react-compiler`, so memoisation is handled automatically rather than scattered `useMemo`/`useCallback` calls.

**Internationalisation** — all UI strings live in `src/messages/en.json` and are accessed via `use-intl`. This is enforced by an ESLint rule that disallows hard-coded string literals in component files, so adding a new language is a matter of dropping in a new messages file.

**Folder structure** — code is split into `pages/`, `components/`, `hooks/`, and `lib/`. Pages own the top-level layout and orchestrate hooks; components are purely presentational; hooks encapsulate all side effects and SDK subscriptions.

## Making this production-ready

- **Move token generation to a backend** — the Twilio API secret is currently embedded in the client bundle (as a `VITE_*` environment variable). In production, token generation should happen on a server and the client should fetch a short-lived token over HTTPS.
- **Test on more browsers and devices** — only tested in Chrome. WebRTC behaviour, camera/mic permissions, and CSS layout all vary across browsers and mobile devices.
- **Error recovery** — add retry logic for failed connections and user-friendly messaging for permission-denied errors (camera/mic blocked).
- **Room access control** — currently anyone who knows a room name can join. A real deployment would authenticate users and validate room access server-side before issuing a token.
