module.exports = {
  name: "ping",
  category: "basic",
  description: "Shows bot latency",

  async execute(message, args) {
    const sent = await message.channel.send("Pinging...");

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);

    sent.edit(
      `Pong\nMessage latency: ${latency}ms\nAPI latency: ${apiLatency}ms`
    );
  }
};