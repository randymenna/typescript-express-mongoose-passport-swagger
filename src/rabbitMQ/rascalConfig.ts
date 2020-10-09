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
                    'location_service:position:report': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'location_service.dead_letter'
                            }
                        }
                    },

                    // Create a queue for processing position alerts
                    'notification_service:position:alert': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'notification_service.dead_letter'
                            }
                        }
                    },

                    // Create a queue for processing sms alerts
                    'sms_service:position:alert': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'sms_service.dead_letter'
                            }
                        }
                    },

                    // Create a queue for processing email alerts
                    'email_service:position:alert': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'email_service.dead_letter'
                            }
                        }
                    },

                    // Create a queue for processing forward messages to devices
                    'websocket_service:message:forward': {
                        'options': {
                            'arguments': {
                                // Route nacked messages to a service specific dead letter queue
                                'x-dead-letter-exchange': 'dead_letters',
                                'x-dead-letter-routing-key': 'websocket_service.dead_letter'
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
                    'dead_letters:location_service': {},
                    'dead_letters:notification_service': {},
                    'dead_letters:sms_service': {},
                    'dead_letters:email_service': {},
                    'dead_letters:websocket_service': {},
                },

                // Bind the queues to the exchanges.
                // A good naming convention for routing keys is producer.entity.event
                'bindings': {
                    // Route service topics to respective queue
                    'service[device_gateway.position.#] -> location_service:position:report': {},
                    'service[notification_service.alert.#] -> notification_service:position:alert': {},
                    'service[sms_service.alert.#] -> sms_service:position:alert': {},
                    'service[email_service.alert.#] -> email_service:position:alert': {},
                    'service[websocket_service.message.#] -> websocket_service:message:forward': {},

                    // Route delayed messages to the 1 minute delay queue
                    'delay[delay.1m] -> delay:1m': {},

                    // Route retried messages back to their original queue using the CC routing keys set by Rascal
                    'retry[device_gateway.position.#] -> location_service:position:report': {},
                    'retry[notification_service.alert.#] -> notification_service:position:alert': {},
                    'retry[sms_service.alert.#] -> sms_service:position:alert': {},
                    'retry[email_service.alert.#] -> email_service:position:alert': {},
                    'retry[websocket_service.message.#] -> notification_service:position:alert': {},

                    // Route dead letters the service specific dead letter queue
                    'dead_letters[location_service.dead_letter] -> dead_letters:location_service': {},
                    'dead_letters[notification_service.dead_letter] -> dead_letters:notification_service': {},
                    'dead_letters[sms_service.dead_letter] -> dead_letters:sms_service': {},
                    'dead_letters[email_service.dead_letter] -> dead_letters:email_service': {},
                    'dead_letters[websocket_service.dead_letter] -> dead_letters:websocket_service': {},
                },

                // Setup subscriptions
                'subscriptions': {

                    'newPositions': {
                        'vhost': 'tracking-vhost',
                        'queue': 'location_service:position:report',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'alertNotifications': {
                        'vhost': 'tracking-vhost',
                        'queue': 'notification_service:position:alert',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'smsAlerts': {
                        'vhost': 'tracking-vhost',
                        'queue': 'sms_service:position:alert',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'emailAlerts': {
                        'vhost': 'tracking-vhost',
                        'queue': 'email_service:position:alert',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                    'forwardMessages': {
                        'vhost': 'tracking-vhost',
                        'queue': 'websocket_service:message:forward',
                        'contentType': 'application/json',
                        'redeliveries': {
                            'limit': 5,
                            'counter': 'shared'
                        }
                    },

                },

                // Setup publications
                'publications': {

                    'newPosition': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'device_gateway.position.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'alertNotification': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'notification_service.alert.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'smsAlert': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'sms_service.alert.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'emailAlert': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'email_service.alert.#',
                        'autoCreated': true,
                        'encryption': 'well-known-v1',
                    },

                    'forwardMessage': {
                        'vhost': 'tracking-vhost',
                        'exchange': 'service',
                        'confirm': true,
                        'timeout': 10000,
                        'routingKey': 'websocket_service.message.#',
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
