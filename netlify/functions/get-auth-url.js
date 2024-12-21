exports.handler = async function (event, context) {
  const SCOPES = ["identify", "guilds", "guilds.members.read", "guilds.join"];

  const loginUrl = `https://discord.com/api/oauth2/authorize?client_id=${
    process.env.DISCORD_CLIENT_ID
  }&response_type=code&redirect_uri=${
    process.env.DISCORD_REDIRECT_URI
  }&scope=${SCOPES.join("+")}`;

  return {
    statusCode: 200,
    body: JSON.stringify({ url: loginUrl }),
  };
};
