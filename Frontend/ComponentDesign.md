# Component Design

High-level component plan for the DevTinder frontend.

## Folder structure

```
src/
  App.jsx          # Router + Redux Provider (composition root)
  main.jsx         # ReactDOM entry point
  layout/          # App shell — rendered on every route
    Body.jsx       # Layout wrapper: NavBar + <Outlet /> + Footer
    NavBar.jsx      # Top navigation, shows logged-in user state
    Footer.jsx      # Site footer
  pages/           # Route-level screens (one per route)
    Login.jsx
    Feed.jsx
    Profile.jsx
  utils/           # Cross-cutting app config and state
    appStore.js    # Redux store
    userSlice.js   # Logged-in user state (addUser / removeUser)
    constants.js   # BASE_URL and other env-driven constants
```

## Routing (App.jsx)

| Path       | Component       | Auth required |
| ---------- | ---------------- | ------------- |
| `/login`   | `pages/Login`     | No            |
| `/feed`    | `pages/Feed`      | Yes           |
| `/profile` | `pages/Profile`   | Yes           |
| `*`        | Not Found         | No            |

All routes render inside `layout/Body`, which provides the persistent `NavBar` + `Footer` shell via `<Outlet />`.

## Component responsibilities

- **layout/Body** — owns the page shell (fixed NavBar, scrollable content area, footer). No business logic.
- **layout/NavBar** — reads `user` from Redux (`useSelector`); shows avatar/menu only when logged in. Will host logout dispatch once auth flow is wired up.
- **layout/Footer** — static, presentational only.
- **pages/Login** — owns its own form state (email/password/error); on success dispatches `addUser` and navigates to `/feed`. Talks to the backend directly via `axios` + `BASE_URL`.
- **pages/Feed** — placeholder; will own the swipe-card feed UI and feed-related API calls.
- **pages/Profile** — placeholder; will own profile view/edit UI.

## State management (utils/)

- **appStore** — single Redux store, combines feature slices.
- **userSlice** — `addUser(user)` sets the logged-in user, `removeUser()` clears it (used for logout). This is the only slice today; future slices (e.g. `feedSlice`, `connectionsSlice`) follow the same pattern and get added to `appStore`.
- **constants** — `BASE_URL` resolved from `VITE_BASE_URL` env var, with a localhost fallback for dev.

## Extensibility guidelines

- **New screen/route** → add a file to `pages/`, register it in `App.jsx`'s `<Routes>`.
- **New piece of persistent app state** → add a slice to `utils/`, register its reducer in `appStore.js`.
- **New shared shell UI** (e.g. a sidebar) → add to `layout/`.
- **Reusable presentational pieces** (buttons, cards, modals used across multiple pages) → introduce a `src/components/` folder once a second consumer appears; don't create it preemptively.
- **API calls** → currently inline in the page that needs them (only Login does this today). Once more than one page needs the same endpoint, extract a small `utils/api.js` wrapper around axios using `BASE_URL`.
