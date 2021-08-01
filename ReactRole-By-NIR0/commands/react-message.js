const messageSchema = require('../events/message')
const { addToCache } = require('../data/rr')
const { MessageEmbed } = require('discord.js')

module.exports = {
    minArgs: 1,
    expectedArgs: `\`\`\`cs
# ${process.env.PREFIX}react <Mention The Channel> <The Message Title>\`\`\``,
    requiredPermissions: ['ADMINISTRATOR'],
    callback: async({ message, args }) => {
        const { guild, mentions } = message
        const { channels } = mentions
        const targetChannel = channels.first() || message.channel
        if (channels.first()) {
            args.shift()
        }

        const text = args.join(' ')

        const newMessage = await targetChannel.send(text)

        if (guild.me.hasPermission('MANAGE_MESSAGES')) {
            message.delete()
        }

        if (!guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send(new MessageEmbed().setColor('RED').setTitle(`**❌ | The Bot Need \`MANAGE_ROLES\` And \`MANAGE_MESSAGES\` Permission!**`))
            return
        }

        addToCache(guild.id, newMessage)

        new messageSchema({
                guildId: guild.id,
                channelId: targetChannel.id,
                messageId: newMessage.id,
            })
            .save()
            .catch(() => {
                message
                    .channel.send(new MessageEmbed().setColor('RED').setTitle(`**❌ | OMG! The Bot Can't Save Data To The DataBase, Dm @ニロ#0001 Ro Fix The Problem**`))
                    .then((message) => {
                        message.delete({
                            timeout: 1000 * 10,
                        })
                    })
            })
    },
}