# JobTrack redesign

## Run locally
1. Extract this folder.
2. Keep your Firebase project config in `js/firebase-config.js`.
3. From this folder run `npm install`.
4. Run `npm run dev`.
5. Open the Vite URL shown in the terminal.

## Structure
- `index.html`: authentication and shared app shell
- `pages/`: separate HTML page templates / page structure references
- `js/`: JavaScript modules, components, page renderers, and features
- `css/`: theme tokens, layout, components, pages, motion, responsive styles

## Firebase
The project expects `js/firebase-config.js` to export `firebaseConfig`.
Example:
```js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
The included config is carried over from the uploaded project. Firebase web API keys are not server secrets; protect your data with Firebase Authentication, Firestore Security Rules, and API restrictions.
