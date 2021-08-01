const { MessageEmbed } = require('discord.js')

module.exports = {
    callback: async({ message }) => {
        if (!message.channel.guild) return;
        if (message.author.bot) return;
        message.channel.send(
            new MessageEmbed()
            .setAuthor("❗ Bot Orders!", message.author.avatarURL({ dynamic: true }))
            .setDescription(`**You Can Make A Bot Like This From [Here](https://github.com/NIR0-V/Ultra-React.Role.Bot-By-Niro-.git) 🤩**`)
            .setColor('GREEN')
            .setFooter('Request By ' + message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .addFields({
                name: `\`-\` ${process.env.PREFIX}react-message`,
                value: `${process.env.PREFIX}react-message <#channel> <Message Title>`,
                inline: false
            }, {
                name: `\`-\` ${process.env.PREFIX}react`,
                value: `${process.env.PREFIX}react <Reaction> <Role Mention> <The Reaction Role Message Field>`,
                inline: false
            }
            )
        )
    }
}