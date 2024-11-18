const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: 'https://192.168.33.109:7096',
    secure: false
  }
]

module.exports = PROXY_CONFIG;
