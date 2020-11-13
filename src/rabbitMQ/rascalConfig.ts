export const rabbitConfig = {
    'rascal': {
        'vhosts': {

            // Define the name of the vhost
            'tracking-vhost': {

                // Creates the vhost if it doesn't exist (requires the RabbitMQ management plugin to be installed)
                'assert': true,

                // Define the vhost connection parameters. Specify multiple entries for clusters.
                // Rascal will randomise the list, and cycle through the entries until it finds one that works
                'connections': [{
                    'url': 'amqp://localhost'
                },
                    {
                        'user': '***',
                        'password': '***',
                        'port': 5672,
                        'options': {
                            'heartbeat': 1
                        },
                        socketOptions: {
                            timeout: 1000
                        }
                    }
                ],

                // Define exchanges within the registration vhost
                'exchanges': [
                    'service',     // Shared exchange for all services within this vhost
                    'delay',       // To delay failed messages before a retry
                    'retry',       // To retry failed messages up to maximum number of times
                    'dead_letters' // When retrying fails, messages end up here
                ],

                // Define queues within the registration vhost
                // A good naming convention for queues is consumer:entity:action
                'queues': {

                    // Create a queue processing positions
                    'raw': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'raw.dead_letter'
                            }
                        }
                    },

                    'notify': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'notify.dead_letter'
                            }
                        }
                    },

                    'sms': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'sms.dead_letter'
                            }
                        }
                    },

                    'email': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'email.dead_letter'
                            }
                        }
                    },

                    'socket': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'socket.dead_letter'
                            }
                        }
                    },

                    'forward': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'forward.dead_letter'
                            }
                        }
                    },

                    // Create a delay queue to hold failed messages for a short interval before retrying
                    'delay:1m': {
                        'options': {
                            'arguments': {
                                // Configure messages to expire after 1 minute, then route them to the retry exchange
                                'x-message-ttl': 60000,
                                'x-dead-letter-exchange': 'retry'
                            }
                        }
                    },

                    // Queue for holding dead letters until they can be resolved
                    'dead_letters:raw': {},
                    'dead_letters:notify': {},
                    'dead_letters:sms': {},
                    'dead_letters:email': {},
                    'dead_letters:socket': {},
                    'dead_letters:forward': {},
                },

                // Bind the queues to the exchanges.
                // A good naming convention for routing keys is producer.entity.event
                'bindings': {
                    // Route service topics to respective queue
                    'service[raw.position.#] -> raw': {},
                    'service[notify.alert.#] -> notify': {},
                    'service[sms.message.#] -> sms': {},
                    'service[email.message.#] -> email': {},
                    'service[socket.message.#] -> socket': {},
                    'service[forward.message.#] -> forward': {},

                    // Route delayed messages to the 1 minute delay queue
                    'delay[delay.1m] -> delay:1m': {},

                    // Route retried messages back to their original queue using the CC routing keys set by Rascal
                    'retry[raw.position.#] -> raw': {},
                    'retry[notify.alert.#] -> notify': {},
                    'retry[sms.message.#] -> sms': {},
                    'retry[email.message.#] -> email': {},
                    'retry[socket.message.#] -> socket': {},
                    'retry[forward.message.#] -> forward': {},

                    // Route dead letters the service specific dead letter queue
                    'dead_letters[raw.dead_letter] -> dead_letters:raw': {},
                    'dead_letters[notify.dead_letter] -> dead_letters:notify': {},
                    'dead_letters[sms.dead_letter] -> dead_letters:sms': {},
                    'dead_letters[email.dead_letter] -> dead_letters:email': {},
                    'dead_letters[socket.dead_letter] -> dead_letters:socket': {},
                    'dead_letters[forward.dead_letter] -> dead_letters:forward': {},
                },

                // Setup subscriptions
                'subscriptions': {

                    'positions': {
                        'vhost': 'tracking-vhost',
                        'queue': 'raw',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'alerts': {
                        'vhost': 'tracking-vhost',
                        'queue': 'notify',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'smsMessages': {
                        'vhost': 'tracking-vhost',
                        'queue': 'sms',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'emailMessages': {
                        'vhost': 'tracking-vhost',
                        'queue': 'email',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'forwardMessages': {
                        'vhost': 'tracking-vhost',
                        'queue': 'forward',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'socketMessages': {
                        'vhost': 'tracking-vhost',
                        'queue': 'socket',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                },

                // Setup publications
                'publications': {

                    'positions': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'raw.position.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'alerts': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'notify.alert.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'smsMessage': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'sms.message.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'emailMessage': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'email.message.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'forwardMessage': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'forward.message.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'socketMessage': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'socket.message.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    // Forward messages to the 1 minute delay queue when retrying
                    'retry_in_1m': {
                        'exchange': 'delay',
                        'options': {
                            'CC': ['delay.1m']
                        }
                    },
                },

                // Configure confirm channel pools. See https://www.npmjs.com/package/generic-pool
                // The demo application doesn't publish using regular channels. A regular pool will be created by default, but
                // never allocated channels because autostart defaults to false.
                'publicationChannelPools': {
                    'confirmPool': {
                        max: 10,
                        min: 5,
                        autostart: true
                    }
                }
            }
        },
        // Define recovery strategies for different error scenarios
        'recovery': {

            // Deferred retry is a good strategy for temporary (connection timeout) or unknown errors
            'deferred_retry': [{
                'strategy': 'forward',
                'attempts': 10,
                'publication': 'retry_in_1m',
                'xDeathFix': true // See https://github.com/rabbitmq/rabbitmq-server/issues/161
            }, {
                'strategy': 'nack'
            }],

            // Republishing with immediate nack returns the message to the original queue but decorates
            // it with error headers. The next time Rascal encounters the message it immediately nacks it
            // causing it to be routed to the services dead letter queue
            'dead_letter': [{
                'strategy': 'republish',
                'immediateNack': true
            }]
        },
        // Define counter(s) for counting redeliveries
        'redeliveries': {
            'counters': {
                'shared': {
                    'size': 10,
                    'type': 'inMemoryCluster'
                }
            }
        },
        // Define encryption profiles
        'encryption': {
            'well-known-v1': {
                'key': 'f81db52a3b2c717fe65d9a3b7dd04d2a08793e1a28e3083db3ea08db56e7c315',
                'ivLength': 16,
                'algorithm': 'aes-256-cbc'
            }
        }
    }
};
