module.exports = async(client) => {
    console.table({
        Developer_Name: 'NIR0',
        Support_Server: 'https://discord.gg/naar',
        github_page: 'https://github.com/NIR0-V'
    })
    console.table({
        "Name": `${client.user.username}`,
        "Prefix": `${process.env.PREFIX}`,
        "Users": `${client.users.cache.size}`,
        "Channels": `${client.channels.cache.size}`,
        "Servers": `${client.guilds.cache.size}`
    })
    console.log(`[ ${client.user.tag} ] is ready`);
    client.user.setActivity(`${process.env.PREFIX}help`, { type: 'PLAYING' })
};