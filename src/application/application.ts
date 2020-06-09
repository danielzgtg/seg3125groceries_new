import Cart from './services/cart';
import CrashHandler from './components/crashHandler';
import { findOrThrow } from '../utils';
import MainPage from '../pages/main';
import Warehouse from './services/warehouse';

/**
 * The global application state and data model.
 */
export default class Application {
    readonly warehouse: Warehouse;
    readonly cart: Cart;

    constructor(outermost: HTMLElement) {
        // Error reporter
        new CrashHandler(findOrThrow(outermost, 'failure', HTMLDivElement));

        // Data model
        this.warehouse = new Warehouse;
        this.cart = new Cart;

        // Initial page
        new MainPage(this, outermost);
    }
}
