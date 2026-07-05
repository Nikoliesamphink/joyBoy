🤖 JOY CANNOT — Discord Bot
===========================

> A professional, production-ready multi-purpose Discord bot built with `discord.py 2.x`.

---

✨ Features
-----------

| System | Description |
|---|---|
| 🛡️ Moderation | `kick`, `ban`, `unban`, `timeout`, `untimeout`, `warn`, `warnings`, `unwarn`, `clearwarnings`, `purge`, `lock`, `unlock`, `slowmode` |
| 🎭 Role & Voice | `addrole`, `removerole`, `move` |
| ℹ️ Info | `userinfo`, `serverinfo`, `avatar`, `ping`, `addemoji`, `profile` |
| 🎫 Ticket System | Panel with custom title + description, per-ticket dedicated log channel (auto-created and archived on close), configurable support role & max tickets per user |
| 📅 Scheduled Event | Creates a native Discord Scheduled Event and posts an announcement embed to a normal text channel — works via prefix (`event create`) or `/createvent` |
| 🎉 Giveaway | `giveaway start/end/reroll/list` with optional required role & winner role |
| 🚫 Antispam | Honeypot channel that auto-bans anyone who posts in it, cross-channel spam detection, dedicated mod-log channel |
| 💎 Premium System | Owner can lock/unlock specific commands to Premium-only, grant premium with auto-expiry (`grantpremium @user 7d/30d/permanent`), premium users get no-prefix access automatically |
| 🚨 Maintenance Mode | Owner-only switch that locks every command for everyone except the owner while the bot is under maintenance |
| ✨ No-Prefix | Owner, whitelisted users/guilds, and Premium users can run commands without typing the prefix |
| 🏅 Profile & Badges | Founder/Developer/Management/Staff/Premium/No-Prefix/User badges, command-usage counter, badge auto-granted on joining the support server |
| 💬 Mention as Prefix | Tagging the bot (`@JOY CANNOT`) alone shows a quick help hint; tagging it followed by a command (`@JOY CANNOT ban @user`) runs that command directly |
| 🎛️ Interactive Help | `!joy help` / `/help` opens a category-based menu (dropdown + Home button); the Owner Only category is completely hidden from non-owners |

---

🛠️ Setup
---------

### 1. Prerequisites

- Python `3.11+`
- A Discord bot application ([Discord Developer Portal](https://discord.com/developers/applications))
  - **Privileged Gateway Intents** required: `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`

### 2. Clone the repo

```bash
git clone https://github.com/Nikoliesamphink/joyBoy.git
cd joyBoy
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the root directory (or set these directly in your host, e.g. Railway → Variables):

```
DISCORD_TOKEN=your_bot_token_here
OWNER_ID=your_discord_user_id_here
SUPPORT_SERVER_ID=your_support_server_id_here
SUPPORT_INVITE=https://discord.gg/your_invite_code
```

| Variable | Required | Description |
|---|---|---|
| `DISCORD_TOKEN` | ✅ | Your bot's token from the Developer Portal |
| `OWNER_ID` | ✅ | Your Discord user ID — grants Founder rank + full owner-only command access |
| `SUPPORT_SERVER_ID` | Optional | Guild ID of your support server — members who join it automatically get the **USER** badge |
| `SUPPORT_INVITE` | Optional | Invite link shown on the profile card and the help menu's Support Server button |

### 5. Configure emojis (optional)

Edit `emoji_config.py` and fill in the custom emoji IDs for badges/icons used across embeds. Leave blank to fall back to defaults.

### 6. Run the bot

```bash
python bot.py
```

---

📌 Prefix
---------

- **`!joy`** (main) or **`!j`** (short alias)
- Owner, Premium users, and anyone whitelisted with `noprefix` can run commands without typing the prefix at all.
- Tagging the bot also works as a prefix: `@JOY CANNOT profile`.

---

👑 Owner-Only Commands
-----------------------

These are never shown to anyone else in `help`, on prefix or slash:

- `maintenance on/off/status`
- `noprefix grant/revoke/list`
- `botrole set/remove/list`
- `grantpremium @user <duration>/revoke`
- `premiumlock add/remove/list <command>`
- `syncsupport`
- `blacklist add/remove/list`
- `vxleave <guild_id>`

---

📄 License
----------

For personal / internal use. Not affiliated with Discord Inc.
