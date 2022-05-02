const { retrieveHeaders } = require('./config/kafka')
const repository = require('./repository')

const handler = {
  async producer(event) {
    console.log('Event Producer: ', JSON.stringify(event))
    const { headers, body } = event

    const msg = {
      topic: 'mytopic',
      messages: [
        {
          key: headers.cid,
          value: body,
          headers: {
            systemId: headers.systemId,
          }
        }
      ]
    }

    return repository
      .kafka(msg)
      .then((result) => {
        return { statusCode: 201, body: JSON.stringify(result) }
      })
      .catch((err) => {
        console.error('err: ', err)
        const body = JSON.stringify(err.body ?? err.message)
        const statusCode = err.meta?.statusCode ?? 500
        return { statusCode, body }
      })
  },

  async consumer(event) {
    console.log('Event Consumer: ', JSON.stringify(event))

    const topic = Object.keys(event.records)[0]

    const promises = event.records[topic]
      .map(async (record) => {
        const { key, value, headers, topic, partition, offset } = record
        const { systemId } = retrieveHeaders(headers)

        console.log(`Successfully consumed message, SystemId: ${systemId}, Topic: ${topic}, Partition: ${partition}`)
        console.log(`[kafka-Consumer][${systemId}] - Key : ${Buffer.from(key, 'base64').toString()}`)
        console.log(`[kafka-Consumer][${systemId}] - Event : ${Buffer.from(value, 'base64').toString()}`)
        console.log(`[kafka-Consumer][${systemId}] - Offset : ${offset}`)
      })
      .flat()

    return Promise.all(promises)
      .then((result) => {
        return { statusCode: 200, body: JSON.stringify(result) }
      })
      .catch((err) => {
        console.error('err: ', err)
        const body = JSON.stringify(err.body ?? err.message)
        const statusCode = err.meta?.statusCode ?? 500
        return { statusCode, body }
      })
  }
}

module.exports = handler