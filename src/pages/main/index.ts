import type Application from '../../application/application';
import CartBar from './components/cartBar';
import Checkout from './components/checkout';
import { findOrThrow } from '../../utils';
import { MainPageStateMachine } from './state';
import Processing from './components/processing';
import SalesFloor from './components/salesFloor';
import Settings from './components/settings';

/**
 * The main page controller.
 */
export default class MainPage {
    readonly stateMachine: MainPageStateMachine;

    readonly cartBar: CartBar;
    readonly settings: Settings;
    readonly salesFloor: SalesFloor;
    readonly checkout: Checkout;
    readonly processing: Processing;

    constructor(application: Application, outermost: HTMLElement) {
        // Data
        const stateMachine = this.stateMachine = new MainPageStateMachine;
        const { cart, warehouse } = application;

        // UI binding
        this.cartBar = new CartBar(
            findOrThrow(outermost, 'cart-bar', HTMLDivElement),
            cart, stateMachine,
        );
        const settings = this.settings = new Settings(
            findOrThrow(outermost, 'settings', HTMLDivElement),
            stateMachine,
        );
        this.salesFloor = new SalesFloor(
            findOrThrow(outermost, 'sales-floor', HTMLDivElement),
            warehouse, cart,
            settings,
            stateMachine,
        );
        this.checkout = new Checkout(
            findOrThrow(outermost, 'checkout', HTMLDivElement),
            warehouse, cart,
            stateMachine,
        );
        this.processing = new Processing(
            findOrThrow(outermost, 'processing', HTMLDivElement),
            cart, stateMachine,
        );

        // Initial Tick
        warehouse.refresh();
    }
}
