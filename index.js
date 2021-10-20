const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const { Player } = require("discord-music-player");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply("Server info.");
  } else if (commandName === "user") {
    await interaction.reply("User info.");
  } else if (commandName === "stupid") {
    await interaction.reply("ShaYue and SeyaNa");
  } else if (commandName === "handsome") {
    await interaction.reply("Wuuu");
  }
});

//Youtube music commands
const settings = {
  prefix: "!",
};

const player = new Player(client, {
  leaveOnEmpty: false, // This options are optional.
});
client.player = player;

client.on("messageCreate", async (message) => {
  const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/ +/g);
  console.log(args);
  const command = args.shift();
  console.log(client.player);
  let guildQueue = client.player.getQueue(message.guild.id);

  if (command === "play") {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.play(args.join(" ")).catch((_) => {
      if (!guildQueue) queue.stop();
    });
  }

  if (command === "playlist") {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.playlist(args.join(" ")).catch((_) => {
      if (!guildQueue) queue.stop();
    });
  }

  if (command === "skip") {
    guildQueue.skip();
  }

  if (command === "stop") {
    guildQueue.stop();
  }

  if (command === "removeLoop") {
    guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
  }

  if (command === "toggleLoop") {
    guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
  }

  if (command === "toggleQueueLoop") {
    guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
  }

  if (command === "setVolume") {
    guildQueue.setVolume(parseInt(args[0]));
  }

  if (command === "seek") {
    guildQueue.seek(parseInt(args[0]) * 1000);
  }

  if (command === "clearQueue") {
    guildQueue.clearQueue();
  }

  if (command === "shuffle") {
    guildQueue.shuffle();
  }

  if (command === "getQueue") {
    console.log(guildQueue);
  }

  if (command === "getVolume") {
    console.log(guildQueue.volume);
  }

  if (command === "nowPlaying") {
    console.log(`Now playing: ${guildQueue.nowPlaying}`);
  }

  if (command === "pause") {
    guildQueue.setPaused(true);
  }

  if (command === "resume") {
    guildQueue.setPaused(false);
  }

  if (command === "remove") {
    guildQueue.remove(parseInt(args[0]));
  }

  if (command === "createProgressBar") {
    const ProgressBar = guildQueue.createProgressBar();

    // [======>              ][00:35/2:20]
    console.log(ProgressBar.prettier);
  }
});
client.login(token);
