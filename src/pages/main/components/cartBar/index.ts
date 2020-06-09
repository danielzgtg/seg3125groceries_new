import type Cart from '../../../../application/services/cart';
import type { MainPageStateMachine } from '../../state';

/**
 * A floating bottom bar like the old Google Drive app.
 */
export default class CartBar {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    /**
     * An element to display the count
     */
    private readonly display: HTMLElement;

    constructor(outermost: HTMLElement, cart: Cart, stateMachine: MainPageStateMachine) {
        this.outermost = outermost;
        // Wire the actual visible bar
        const main = outermost.querySelector('aside');
        if (!main) {
            throw new TypeError;
        }
        // Bind the text
        const display = outermost.querySelector('span');
        if (!display) {
            throw new TypeError;
        }
        this.display = display;
        // Propagate cart total count changes to the UI
        // This assumes that the cart is empty at the start
        cart.onTotalChanged = () => {
            const totalCount = cart.getTotalCount();
            this.display.innerText = `${totalCount} items`;
            this.outermost.hidden = !totalCount;
        };

        // Clicks open the cart
        main.onclick = () => stateMachine.checkout();
    }
}
