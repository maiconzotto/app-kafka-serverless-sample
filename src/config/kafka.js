const { Kafka } = require('kafkajs') 

const kafkaConfigs = new Kafka({
  clientId: 'app-kafka-sample',
  brokers: ['myBrokers:9096']
})

const retrieveHeaders = (headers) => {
  const json = {}
  headers.forEach((header) => {
    const keys = Object.entries(header)
    keys.forEach((key) => {
      json[key[0]] = Buffer.from(key[1]).toString()
    })
  })
  return json
}

module.exports = {
  kafkaConfigs,
  retrieveHeaders
}
