const { fetchCache, addToCache } = require('../data/rr')
const messageSchema = require('../events/message')
const { MessageEmbed } = require('discord.js')

module.exports = {
    minArgs: 3,
    expectedArgs: `\`\`\`cs
# ${process.env.PREFIX}react <Emoji> <Mention Role> <Then In The Message>\`\`\``,
    requiredPermission: ['ADMINISTRATOR'],
    callback: async({ message, args }) => {
        const { guild } = message

        if (!guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send(new MessageEmbed().setColor('RED').setTitle(`**❌ | The Bot Need \`MANAGE_ROLES\` And \`MANAGE_MESSAGES\` Permission!**`))
            return
        }

        let emoji = args.shift()
        let role = args.shift()
        const displayName = args.join(' ')

        if (role.startsWith('<@&')) {
            role = role.substring(3, role.length - 1)
        }

        const newRole =
            guild.roles.cache.find((r) => {
                return r.name === role || r.id === role
            }) || null

        if (!newRole) {
            message.channel.send(new MessageEmbed().setColor('RED').setTitle(`**❌ | I Can't Find \`${role}\` Role!**`))
            return
        }

        role = newRole

        if (emoji.includes(':')) {
            const emojiName = emoji.split(':')[1]
            emoji = guild.emojis.cache.find((e) => {
                return e.name === emojiName
            })
        }

        const [fetchedMessage] = fetchCache(guild.id)
        if (!fetchedMessage) {
            message.channel.send(new MessageEmbed().setColor('RED').setTitle(`**❌ | Soory But Do You Make A Reaction Role Message?**`))
            return
        }

        const newLine = `${emoji} ${displayName}`
        let { content } = fetchedMessage

        if (content.includes(emoji)) {
            const split = content.split('\n')

            for (let a = 0; a < split.length; ++a) {
                if (split[a].includes(emoji)) {
                    split[a] = newLine
                }
            }

            content = split.join('\n')
        } else {
            content += `\n${newLine}`
            fetchedMessage.react(emoji)
        }

        fetchedMessage.edit(content)

        const obj = {
            guildId: guild.id,
            channelId: fetchedMessage.channel.id,
            messageId: fetchedMessage.id,
        }

        await messageSchema.findOneAndUpdate(
            obj, {
                ...obj,
                $addToSet: {
                    roles: {
                        emoji,
                        roleId: role.id,
                    },
                },
            }, {
                upsert: true,
            }
        )

        addToCache(guild.id, fetchedMessage, emoji, role.id)
    },
}