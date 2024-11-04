# time-zone

This bot convert time zones in discord to avoid confusion in scheduling meetings
Here's a sample README for your Discord bot:

```markdown
# Discord Bot

This is a simple Discord bot that includes several commands for interacting with users, managing timezones, and converting time formats.

## Commands

The bot currently supports the following commands:

1. **Ping**: Check if the bot is responsive.

   - **Usage**: `/ping`

2. **Set Timezone**: Set your preferred timezone.

   - **Usage**: `/settimezone [timezone]`

3. **Show Timezone**: Display the current timezone setting for the user.

   - **Usage**: `/showtimezone`

4. **Convert**: Convert time between different timezones.
   - **Usage**: `/convert [time] [from timezone]`

## Setup

### Prerequisites

Make sure you have the following environment variables set up in your `.env` file:
```

DISCORD_CLIENT_ID
PUBLIC_KEY=
DISCORD_TOKEN=
GUILD_ID=
MONGO_URL=

````

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/harwarl/time-zone.git
````

2. Navigate to the project directory:

   ```bash
   cd time-zone
   ```

3. Install the dependencies using Yarn:

   ```bash
   yarn install
   ```

### Running the Bot

To start the bot, run:

```bash
yarn build
yarn start
```

To run the bot in development mode, run

```bash
yarn dev
```

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or new features!

## License

This project is licensed under the MIT License. See the LICENSE file for details.

```

```
