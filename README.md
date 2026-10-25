# Shane Ramirez Portfolio

Static site, no build step. Serve it over HTTP for local preview (the chatbot knowledge module is an ES module), or deploy the folder to GitHub Pages.

- `framework.html`  project workflow, skills, and areas of expertise
- The desktop navigation can be collapsed and remembers its state; on smaller screens, use the menu button to open it
- The sidebar has a larger profile image and a boxed collapse control; theme and text-size controls are available on both pages
- The home page includes project and skill overview tiles, a swipeable tools strip, and a restrained blue-green palette
- Click the profile portrait to switch between the photo and illustrated versions
- `assets/certs/`  original certificate PDFs; the gallery shows real PDF-page previews and lets visitors view or download each certificate
- Moana keeps the dog avatar and floating widget, with AI replies through a Cloudflare Worker and an instant, knowledge-grounded local fallback. `js/knowledge.js` is the shared portfolio knowledge source for the browser and Worker. The widget does not save conversation history after the page session.

## Chatbot setup

1. In Cloudflare, log in with Wrangler if this is the first deployment. From the `js/` directory, deploy the Worker with `npx wrangler@latest deploy` (Wrangler 4.36 or newer is required for the configured rate-limit binding).
2. Add the OpenAI key as a Worker secret with `npx wrangler@latest secret put OPENAI_API_KEY`. Wrangler prompts for the value; never put it in a site file.
3. The configured allowed origin is `https://memonttorrie.github.io`, inferred from this repository’s GitHub Pages setup. If Pages uses a custom domain, change `ALLOWED_ORIGIN` in `js/wrangler.toml` to that exact origin and redeploy.
4. Copy the deployed Worker URL into the `API_URL` constant near the top of `js/chatbot.js`, then publish the site to GitHub Pages.

The Worker limits messages to 1,400 characters and rate-limits each anonymous client to 8 messages per minute using Cloudflare’s approximate, per-edge rate limiter. The built-in fallback remains active if the Worker is unset or unavailable. The contact section currently has a placeholder email link (`you@example.com`); update it in `index.html` before promoting email as a working contact method.

- `css/tokens.css`  colors, fonts, radius, easing (edit here to restyle everything)
- `css/base.css`, `components.css`, `animations.css`
- `js/data.js`  all text content (skills, projects, experience, certs); `js/accessibility.js` manages text-size preferences
- `js/cursor.js` custom cursor, `animations.js` effects, `theme.js` dark mode, `render.js`, `main.js`
- Profile photo and illustration live in `assets/images/`; resume in `resume/`; PDFs in `assets/certs/`
