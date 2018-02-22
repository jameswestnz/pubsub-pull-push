const r2 = require('r2')

module.exports = function(topicName, destination, options) {
    let state = this
    options = options || {}
    options.subscription = options.subscription || {}

    let topic = state.pubsub.topic(topicName)
    let subscription = topic.subscription(options.subscription.name || 'pull-push')

    return subscription.get({
        autoCreate: options.subscription.autoCreate || false
    })
        .then(() => {
            return new Promise((resolve, reject) => subscription.request({
                client: 'SubscriberClient',
                method: 'pull',
                reqOpts: {
                    subscription: subscription.name,
                    maxMessages: options.maxMessages || 1000
                }
            }, function(err, response) {
                if(err) reject(err)
                resolve(response.receivedMessages)
            }))
        })
        .then(messages => {
            return Promise.all(messages.map(message => {
                return r2.post(destination, {
                    json: message
                }).response
                    .then(() => {
                        if(options.autoAcknowledge) {
                            return subscription.acknowledge_([
                                message.ackId
                            ])
                        }
                    })
                    .then(() => {
                        // message success event
                        state.emitter.emit('message-push', message)
                    })
                    .catch(err => {
                        // message error event
                        state.emitter.emit('message-error', message)
                        return err
                    })
            }))
        })
}