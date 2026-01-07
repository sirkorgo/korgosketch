## 🎈 korgosketch
A multiplayer art canvas powered by PartyKit. 

### Dependencies
- Node.js
- PartyKit

### Demos
**PartyKit**: https://korgosketch.sirkorgo.partykit.dev <br>
**sirkorgo.com**: ~~[https://www.sirkorgo.com](https://www.sirkorgo.com/chat)~~ (Currently unavailable)

### Setup Instructions
**Option 1: Using only PartyKit Domain**
<br>
```bash
git clone https://github.com/sirkorgo/korgosketch.git
cd korgosketch
npx partykit deploy
```
From here, visit the project at your PartyKit domain (eg: korgosketch.your-username.partykit.dev)

---
**Option 2: Embed on your own site**
1. Setup PartyKit:
```bash
git clone https://github.com/sirkorgo/korgosketch.git
cd korgosketch
npx partykit deploy
```
2. Copy `client/client.html` to your preferred directory on your site
3. Replace `korgosketch.your-username.partykit.dev` on line 150 with the PartyKit domain you deployed to.
4. Create an iframe that links the client.html
Example:
```html
<iframe style="border: 0;" width="720px" height="750px" src="/path/to/client.html"></iframe>
```
> I recommend using 720x750 or bigger for the iframe size to prevent any issues.
