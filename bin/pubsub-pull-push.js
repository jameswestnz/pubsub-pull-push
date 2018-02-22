#!/usr/bin/env node

require('yargs')
    .alias('h', 'help')
    .command(
        '$0 <topic> <destination>',
        'Pull messages from a PubSub topic, push to an endpoint.',
        (yargs) => {
            yargs.positional('topic', {
                type: 'string',
                describe: 'topic name'
            })

            yargs.positional('destination', {
                type: 'string',
                describe: 'Destination URL'
            })

            yargs.positional('maxMessages', {
                type: 'number',
                describe: 'The maximum number or messages to pull from the topic'
            })

            yargs.positional('autoAcknowledge', {
                type: 'boolean',
                describe: 'Acknowledge messages un successful push'
            })
        },
        function (argv) {
            const PullPush = require('../src')()

            console.log('Pulling messages from topic...')

            PullPush.on('message-push', function(message) {
                console.log('Message pushed', message)
            })

            PullPush.on('message-error', function(message) {
                console.log('Message failed', message)
            })

            PullPush.pull(argv.topic, argv.destination, {
                maxMessages: argv.maxMessages,
                autoAcknowledge: argv.autoAcknowledge
            })
        }
    )
    .help()
    .wrap(null)
    .argv