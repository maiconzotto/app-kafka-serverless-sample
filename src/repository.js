const { kafkaConfigs } = require('./config/kafka')

const repository = {
  async kafka(record) {
    const producer = kafkaConfigs.producer({})

    await producer.connect()

    return producer
      .send(record)
      .then((result) => result)
      .catch((error) => {
        console.log(JSON.stringify({ title: 'kafka insert throw', error, message: error.message, record }))
        throw error
      })
  }
}

module.exports = repository
