import { default as EventsDispatcher } from '../events/dispatcher';
import Strategy from '../strategies/strategy';
import StrategyRunner from '../strategies/strategy_runner';
import Timeline from '../timeline/timeline';
import { OneOffTimer as Timer } from '../utils/timers';
import { ConnectionCallbacks, ErrorCallbacks, HandshakeCallbacks } from './callbacks';
import Connection from './connection';
import ConnectionManagerOptions from './connection_manager_options';
export default class ConnectionManager extends EventsDispatcher {
    key: string;
    options: ConnectionManagerOptions;
    state: string;
    connection: Connection;
    usingTLS: boolean;
    timeline: Timeline;
    socket_id: string;
    unavailableTimer: Timer;
    activityTimer: Timer;
    retryTimer: Timer;
    activityTimeout: number;
    strategy: Strategy;
    runner: StrategyRunner;
    errorCallbacks: ErrorCallbacks;
    handshakeCallbacks: HandshakeCallbacks;
    connectionCallbacks: ConnectionCallbacks;
    constructor(key: string, options: ConnectionManagerOptions);
    connect(): void;
    send(data: any): boolean;
    send_event(name: string, data: any, channel?: string): boolean;
    disconnect(): void;
    isUsingTLS(): boolean;
    private startConnecting;
    private abortConnecting;
    private disconnectInternally;
    private updateStrategy;
    private retryIn;
    private clearRetryTimer;
    private setUnavailableTimer;
    private clearUnavailableTimer;
    private sendActivityCheck;
    private resetActivityCheck;
    private stopActivityCheck;
    private buildConnectionCallbacks;
    private buildHandshakeCallbacks;
    private buildErrorCallbacks;
    private setConnection;
    private abandonConnection;
    private updateState;
    private shouldRetry;
}