import { MainPageStateMachine, ProcessingState } from '../../state';
import type Cart from '../../../../application/services/cart';

/**
 * A payment processor.
 */
export default class Processing {
    /**
     * The element which acts as a switch
     */
    private readonly control: HTMLElement;

    constructor(outermost: HTMLElement, cart: Cart, stateMachine: MainPageStateMachine) {
        // Find the element used as an switch switch
        const control = outermost.querySelector('section');
        if (!control) {
            throw new TypeError;
        }
        this.control = control;

        // State transitions
        stateMachine.addListener((src, dest) => {
            // Show this intermission when it's time
            if (dest instanceof ProcessingState) {
                // Reset
                outermost.hidden = false;
                control.hidden = false;
                // Wire some timers
                setTimeout(() => {
                    // Show checkmark
                    control.hidden = true;
                    // Empty cart once payment processed
                    cart.onCheckout = () => {
                        cart.onCheckout = void 0;
                        // Dismiss after 1 second
                        setTimeout(() => {
                            stateMachine.salesFloor();
                        }, 1000);
                    };
                    cart.checkout();
                }, 2000);
                stateMachine.addOnceListener(() => {
                    outermost.hidden = true;
                });
            }
        });
    }
}
