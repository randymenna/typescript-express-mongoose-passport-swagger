import { BrokerAsPromised } from 'rascal';

export class RabbitMQ {
    _broker: any;
    _config: any;

    constructor(config: any) {
        this._config = config;
        this.rabbitError = this.rabbitError.bind(this);
        process
            .on('SIGINT', this.shutdown.bind(this, 0))
            .on('SIGTERM', this.shutdown.bind(this, 0))
            .on('unhandledRejection', (reason, p) => {
                console.error(reason, 'Unhandled Rejection at Promise', p);
                this.shutdown(-1);
            })
            .on('uncaughtException', (err) => {
                console.error('Uncaught Exception thrown', err);
                this.shutdown(-2);
            });
    }

    public async connect() {
        this._broker = await BrokerAsPromised.create(this._config.rascal);
        if (this._broker) {
            console.log('Connected to RabbitMQ');
        }
        this._broker.on('error', this.rabbitError);
        this._broker.on('blocked', (reason: string, {vhost, connectionUrl}: { vhost: string, connectionUrl: string }) => {
            console.error(`Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`);
        });
        this._broker.on('unblocked', ({vhost, connectionUrl}: { vhost: string, connectionUrl: string }) => {
            console.error(`Vhost: ${vhost} was unblocked using connection: ${connectionUrl}.`);
        });
        return (this._broker != null);
    }

    public async subscribe(topic: string, handler: (message: any, content: any, ackOrNack: Function) => void) {
        try {
            const subscription = await this._broker.subscribe(topic);
            subscription.on('message', handler)
                        .on('invalid_content', (err: any, message: any, ackOrNack: Function) => {
                            console.error('Invalid Content', err.message);
                            ackOrNack(err, this._broker.config.recovery.dead_letter);
                        })
                        .on('redeliveries_exceeded', (err: any, message: any, ackOrNack: Function) => {
                            console.error('Redeliveries Exceeded', err.message);
                            ackOrNack(err, this._broker.config.recovery.dead_letter);
                        })
                        .on('cancel', this.rabbitError)
                        .on('error', this.rabbitError);
        }
        catch (err) {
            throw new Error(`Rascal config error: ${err.message}`);
        }
    }

    public async publish(toWhere: string, message: any) {
        try {
            const publication = await this._broker.publish(toWhere, JSON.stringify(message));
            publication
                .on('success', () => {
                    // confirmed
                }).on('error', this.rabbitError);
        }
        catch (err) {
            throw new Error(`Rascal config error: ${err.message}`);
        }
    }

    public completeMessageHandling(ackOrNack: Function, err: any) {
        if (!err) {
            return ackOrNack();
        }
        ackOrNack(err, err.recoverable ? this._broker.config.recovery.deferred_retry : this._broker.config.recovery.dead_letter);
    }

    private shutdown(exitVal: number) {
        if (this._broker) {
            this._broker.shutdown(() => process.exit(exitVal));
        }
    }

    private rabbitError(err: string) {
        console.error(err);
    }
}
