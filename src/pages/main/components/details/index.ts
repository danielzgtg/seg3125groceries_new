import { DetailsState, MainPageStateMachine } from '../../state';
import { querySelectorOrThrow, renderPrice } from '../../../../utils';
import type Cart from '../../../../application/services/cart';
import type Warehouse from '../../../../application/services/warehouse';

/**
 * The details view, where the customer looks at the details and adds any quantity to their cart.
 */
export default class Details {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    constructor(outermost: HTMLElement, warehouse: Warehouse, cart: Cart, stateMachine: MainPageStateMachine) {
        this.outermost = outermost;

        // Wire the close button
        const back = querySelectorOrThrow(outermost, '[aria-label]', HTMLDivElement);
        back.onclick = () => stateMachine.salesFloor();

        // Get the elements
        const title = querySelectorOrThrow(outermost, 'h2', HTMLHeadingElement);
        const img = querySelectorOrThrow(outermost, 'h2+div', HTMLDivElement);
        const price = querySelectorOrThrow(outermost, 'span', HTMLSpanElement);
        const quantity = querySelectorOrThrow(outermost, 'input', HTMLInputElement);
        const button = querySelectorOrThrow(outermost, 'section>div', HTMLDivElement);

        // Show the details when opened
        stateMachine.addListener((src, dest) => {
            const active = dest instanceof DetailsState;
            outermost.hidden = !active;
            if (active) {
                const request = dest as DetailsState;
                const details = warehouse.getItem(request.id);
                title.innerText = details.displayName;
                img.style.backgroundImage = `url(${details.imageURL})`;
                price.innerText = renderPrice(details.cents);
            }
        });

        button.onclick = () => {
            // Add to cart
            const num = +quantity.value;
            if (!isFinite(num)) {
                throw new TypeError;
            }
            const state = stateMachine.getValue();
            if (!(state instanceof DetailsState)) {
                throw new TypeError;
            }
            cart.addItem(state.id, num);
            // View cart immediately
            stateMachine.checkout();
        };
    }
}
