
const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    if (!await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This feature is only available on **Premium** guilds.\nTo learn more about how to redeem a premium guild, visit our Patreon https://www.patreon.com/dankmemerbot'
    }
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` permissions.'
    }
    let channel = msg.args.resolveChannel()
    if (!channel) {
      return 'come on you gotta give me a channel name or id to autopost memes to'
    }

    let check = await Memer.db.getAutomemeChannel(msg.channel.guild.id)
    if (check.channel === channel.id) {
      await Memer.db.removeAutomemeChannel(msg.channel.guild.id)
      return `I'll no longer autopost memes in <#${channel.id}>.`
    }
    await Memer.db.addAutomemeChannel(msg.channel.guild.id, channel.id)
    await addCD()

    return check ? `Changed automeme channel from <#${check.channel}> to **<#${channel.id}>**` : `<#${channel.id}> will now post memes every 5 minutes`
  },
  {
    triggers: ['automeme'],
    usage: '{command} [channel]',
    cooldown: 1e4,
    donorBlocked: true,
    description: 'Set up a channel to automatically post memes to every 5 minutes'
  }
)
