# Google PubSub pull-push
A simple tool (CLI too!) to pull a batch of messages from a Google PubSub topic, then proxy to an external endpoint. This is useful when testing PubSub topics in development environments, or could even be used to proxy messages behind a firewall.

# Installation
```sh
npm i -g pubsub-pull-proxy
```

# Usage
## CLI
```sh
pubsub-pull-proxy topic-name https://your-domain.example/some/endpoint --maxMessages 10
```

## Node
```node
const PullPush = require('pubsub-pull-push')()

PullPush.pull('topic-name', 'https://your-domain.example/some/endpoint', {
    maxMessages: 10
})
```