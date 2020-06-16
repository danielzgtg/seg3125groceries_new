import { CheckoutState, DetailsState, MainPageStateMachine, ProcessingState, SalesFloorState } from '../../state';
import { findOrThrow, querySelectorOrThrow } from '../../../../utils';
import type Cart from '../../../../application/services/cart';
import locale from '../../../../locale.json';
import type Settings from '../settings';
import type Warehouse from '../../../../application/services/warehouse';

/**
 * The breadcrumbs at the top.
 */
export default class Breadcrumbs {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    constructor(
        outermost: HTMLElement,
        warehouse: Warehouse, cart: Cart, settings: Settings,
        stateMachine: MainPageStateMachine,
    ) {
        this.outermost = outermost;

        // Wire the breadcrumbs
        const breadcrumbs = querySelectorOrThrow(outermost, 'nav', HTMLElement);
        // Get the elements
        const sale = findOrThrow(breadcrumbs, 'here-sale', HTMLSpanElement);
        const category = findOrThrow(breadcrumbs, 'here-category', HTMLSpanElement);
        const item = findOrThrow(breadcrumbs, 'here-item', HTMLSpanElement);
        const checkout = findOrThrow(breadcrumbs, 'here-checkout', HTMLSpanElement);
        const payment = findOrThrow(breadcrumbs, 'here-payment', HTMLSpanElement);
        // Bind to state
        const doRefresh = () => {
            const current = stateMachine.getValue();
            // Reset
            category.hidden = item.hidden = checkout.hidden = payment.hidden = true;
            category.onclick = null;
            sale.className = category.className = item.className = checkout.className = payment.className = '';
            // Handle each separately
            if (current instanceof SalesFloorState || current instanceof DetailsState) {
                let selection = settings.category.getValue();
                if (current instanceof DetailsState) {
                    const details = warehouse.getItem(current.id);
                    item.hidden = false;
                    item.className = 'here';
                    item.innerText = details.displayName;
                    selection = details.category;
                } else if (selection) {
                    category.className = 'here';
                } else {
                    sale.className = 'here';
                }
                if (selection) {
                    category.hidden = false;
                    const categoryDisplay = locale.categories[selection];
                    if (!categoryDisplay) {
                        throw new TypeError;
                    }
                    category.innerText = categoryDisplay;
                    // Bind category navigation
                    category.onclick = () => {
                        if (stateMachine.getValue() instanceof DetailsState) {
                            stateMachine.salesFloor();
                            // Ensure right category set even if we came here without one set
                            settings.category.setValue(selection);
                        }
                    };
                }
            } else { // CheckoutState and ProcessingState
                checkout.hidden = false;
                if (current instanceof ProcessingState) {
                    payment.hidden = false;
                    payment.className = 'here';
                } else {
                    checkout.className = 'here';
                }
            }
        };
        stateMachine.addListener(doRefresh);
        settings.category.addListener(doRefresh);
        doRefresh();
        // Bind rest of navigation
        sale.onclick = () => {
            const current = stateMachine.getValue();
            // Don't be scary and interrupt the payment process
            if (current instanceof DetailsState || current instanceof CheckoutState) {
                // Removing the category will get us all the way back to the beginning
                stateMachine.salesFloor();
            }
            // But still provide the functionality of category reset
            settings.category.setValue(null);
        };

        // Wire the cart bookmark
        const cartBookmark = querySelectorOrThrow(outermost, 'section', HTMLElement);
        // Bind the text
        const display = querySelectorOrThrow(cartBookmark, 'span', HTMLSpanElement);
        // Propagate cart total count changes to the UI
        // This assumes that the cart is empty at the start
        (cart.onTotalChanged = () => {
            const totalCount = cart.getTotalCount();
            display.innerText = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
        })();
        // Clicks open the cart
        cartBookmark.onclick = () => {
            try {
                stateMachine.checkout();
            } catch (err) {
                // Silently ignore checkout button errors
                // There are many state transitions disallowed
            }
        };
    }
}
