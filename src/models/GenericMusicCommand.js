const { GenericCommand } = require('.')

module.exports = class GenericMusicCommand {
  constructor (fn, cmdProps) {
    this.fn = fn
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, addCD, args, cleanArgs }) {
    if (this.cmdProps.requiresPremium && !await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This command is only available on **Premium** guilds.\nTo learn more about how to redeem a premium guild, visit our Patreon https://www.patreon.com/dankmemerbot'
    }
    if (msg.member.voiceState.channelID) {
      const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id)

      if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
        return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif')
      }
    }

    await addCD()

    const music = Memer.musicManager.get(msg.channel.guild.id)
    await music.ready
    music.channel = msg.channel.id

    return this.fn({ Memer, msg, args, addCD, cleanArgs, music })
  }

  get props () {
    return new GenericCommand(
      this.fn,
      Object.assign({
        cooldown: 2000,
        donorCD: 500
      }, this.cmdProps)
    ).props
  }
}
