const crypto = require("crypto")

const jwtSecret = crypto.randomBytes(35).toString("hex")

console.log('Generando token aleatorio:')
console.log(jwtSecret)
console.log('Conserve este token en un lugar seguro.')