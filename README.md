# Chord Chain

Chord Chain is an ear training game where players listen to the daily progression, and attempt to decipher which chords they're hearing. Using the onscreen keyboard, players chords from a chord pallette in the correct sequence. Then press "Enter" for the progression (or Chain) to be evaluated. The player receives two hints: The progression key and scale (ie. C Major, Ionion). The player has a maximum of four guesses before the game end state is triggered. Using on screen buttons, players can play and pause the loop, as well as enable arpeggiation.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.


### Production

Create a production build:

```bash
npm run build
```

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

Make sure to deploy the output of `npm run build`, or use `npm run start` to build and run the bundle locally.

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

### Deploy

Code is deployed automatically by a [Vercel project](https://vercel.com/nathan-charrois-projects ) when changes are detected on `master` in this Github repository.

---

Built with ❤️ in Vancouver
