module.exports = {
  mailTemplate: (message) => { return `<b><a href="http://localhost:3000/auth/confirm/${message}">Click this link to confirm your account</a></b>` }};