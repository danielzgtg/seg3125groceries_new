import type Application from '../../application/application';
import Breadcrumbs from './components/breadcrumbs';
import Checkout from './components/checkout';
import Details from './components/details';
import { findOrThrow } from '../../utils';
import Listings from './components/listings';
import { MainPageStateMachine } from './state';
import Processing from './components/processing';
import SalesFloor from './components/salesFloor';
import Settings from './components/settings';

/**
 * The main page controller.
 */
export default class MainPage {
    readonly stateMachine: MainPageStateMachine;

    readonly breadcrumbs: Breadcrumbs;
    readonly salesFloor: SalesFloor;
    readonly settings: Settings;
    readonly listings: Listings;
    readonly details: Details;
    readonly checkout: Checkout;
    readonly processing: Processing;

    constructor(application: Application, outermost: HTMLElement) {
        // Data
        const stateMachine = this.stateMachine = new MainPageStateMachine;
        const { cart, warehouse } = application;

        // UI binding
        this.salesFloor = new SalesFloor(
            findOrThrow(outermost, 'sales-floor', HTMLDivElement),
            stateMachine,
        );
        const settings = this.settings = new Settings(
            findOrThrow(outermost, 'settings', HTMLDivElement),
        );
        this.listings = new Listings(
            findOrThrow(outermost, 'listings', HTMLDivElement),
            warehouse, cart, settings,
            stateMachine,
        );
        this.details = new Details(
            findOrThrow(outermost, 'details', HTMLDivElement),
            warehouse, cart, stateMachine,
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
        this.breadcrumbs = new Breadcrumbs(
            findOrThrow(outermost, 'breadcrumbs', HTMLDivElement),
            warehouse, cart, settings,
            stateMachine,
        );

        // Initial Tick
        warehouse.refresh();
    }
}
