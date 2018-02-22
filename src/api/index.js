const { EventEmitter } = require('events')
const PubSub = require('@google-cloud/pubsub')

let pull = require('./pull')

module.exports = function(options) {
    options = options || {}

    let scope = {
        options: options,
        pubsub: (options.client instanceof PubSub) ? options.client : PubSub(options.client || {}),
        emitter: new EventEmitter(),
        api: {}
    }

    // bind api methods
    /// events
    //// on
    scope.api.on = (function(eventName, handler) {
        return this.emitter.on(eventName, handler)
    }).bind(scope)

    //// off
    scope.api.off = (function(eventName, handler) {
        return this.emitter.removeListener(eventName, handler)
    }).bind(scope)

    /// pull
    scope.api.pull = pull.bind(scope)

    // only expose api methods publically
    return scope.api
}