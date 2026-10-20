# Pokémon Aurora Cup

Pixel-art browser tournament: River Hop, Pokémon Echo, Thunder Dodge, Oran Berry Delivery.

## Current deployment

Production: https://pokemon-aurora-cup-an-256f.vercel.app
Vercel project: `pokemon-aurora-cup` under team `an-256f`.

The old ChatGPT Sites URL is a separate static deployment. Use the Vercel URL for the online backend.

## Local work

Node.js 24. Run `npm ci`, `npm run build`, `npm test`. Serve `public/` to play offline practice. For full API development, use `npx vercel dev` after linking this existing Vercel project.

## Holder login and shared leaderboard

- Phantom or Solflare signs an expiring, host-specific sign-in message. No transaction is requested.
- Server verifies the Ed25519 signature and issues an HttpOnly secure cookie.
- Holder balance is checked on Solana mainnet using the configured mint and exact integer arithmetic.
- A signed game ticket fixes the wallet, seed, round and accumulated verified score.
- Each ranked round uploads its frame inputs. The server replays the same game logic; it never accepts a client-provided score.
- Completed four-round cups are saved as immutable private Blob records. The global top shows each wallet's best completed cup.
- Rankings are public, including the wallet address and trainer name. Practice scores remain local and do not enter the global top.
- This validates recorded play; it does not prevent bots, automated perfect play or multiple wallets. No money or automatic reward transfers are implemented.

Required Vercel environment variables:

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Random server-only signing secret; already configured on the current project. |
| `BLOB_STORE_ID` | Connected private Blob store; configured on the current project. |
| `TOKEN_MINT` | The actual Solana token mint. **Not configured yet.** |
| `MIN_TOKEN_BALANCE` | Minimum token units, defaults to `1`. |
| `SOLANA_RPC_URL` | Reliable mainnet RPC. Defaults to the public Solana mainnet endpoint; an authenticated RPC is recommended for launch traffic. |

Without `TOKEN_MINT`, practice and the leaderboard page work, but ranked holder play stays closed. This is intentional; it never treats an arbitrary wallet as a holder. Set the token and minimum in Vercel, then redeploy. Secrets belong in Vercel, never GitHub or this ZIP.

## GitHub handoff and automatic deploys

The repository is connected to the existing Vercel project. Pushes or merges to `main` automatically trigger production deployments; other branches and pull requests receive preview deployments.

- Source: https://github.com/Alejandra-1805/pokemon-aurora-cup
- Production: https://pokemon-aurora-cup.vercel.app
- Keep secrets and the Blob store in the existing Vercel project.
- Add the other developer by GitHub username under repository Settings → Collaborators. A public repository link does not grant write access. They can also fork and submit pull requests.
- There is no need to upload the ZIP or deploy manually after each edit.

## Editing the game

- `public/tournament.js`: game logic and minigame drawings.
- `public/pokemon.js`: animated Pokémon sprites and trainer assets.
- `public/entrance.js`, `public/entrance.css`: console intro.
- `public/online.js`: wallet UI, ranked recordings, shared leaderboard.
- `api/index.js`: Vercel API.
- `lib/security.js`: wallet signatures, signed sessions, balance verification.
- `lib/replay.js`: authoritative replay.
- `scripts/build.mjs`: generates the replay snapshot from current game code. Run after every game edit.

Do not change simulation randomness or timing only on the client: the server must run the same source. Build generates `lib/game-source.json` automatically. The GitHub workflow runs backend/replay tests without secrets.

## Assets

Unofficial Pokémon fan demo. Not affiliated with Nintendo, Game Freak, Creatures or The Pokémon Company. Pokémon names and artwork belong to their respective rights holders; this package does not grant rights to those assets.

Animated Pokémon and Oran Berry sprites: https://github.com/PokeAPI/sprites
Trainer sprites and base tiles: https://github.com/pret/pokefirered and https://github.com/pret/pokeemerald
Other scene graphics and UI are procedural.

