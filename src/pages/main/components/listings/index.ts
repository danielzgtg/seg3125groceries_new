import type Cart from '../../../../application/services/cart';
import type { MainPageStateMachine } from '../../state';
import { renderPrice } from '../../../../utils';
import type Settings from '../settings';
import type Warehouse from '../../../../application/services/warehouse';

/**
 * Creates a deal card with the specified data
 */
function createCard(displayName: string, cents: number, imageURL: string): HTMLElement {
    const result = document.createElement('article');
    // Image on top
    const img = document.createElement('div');
    img.style.backgroundImage = `url(${imageURL})`;
    result.appendChild(img);
    // Followed by label below with text
    const label = document.createElement('label');
    // Name comes first
    const nameElement = document.createElement('span');
    nameElement.innerText = displayName;
    label.appendChild(nameElement);
    // Then price
    const priceElement = document.createElement('span');
    priceElement.innerText = renderPrice(cents);
    label.appendChild(priceElement);
    // Commit
    result.appendChild(label);
    return result;
}

/**
 * The place where trading is done.
 */
export default class Listings {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    /**
     * The previous container for all the deal cards
     */
    private container?: HTMLElement;

    constructor(
        outermost: HTMLElement,
        warehouse: Warehouse, cart: Cart, settings: Settings,
        stateMachine: MainPageStateMachine,
    ) {
        this.outermost = outermost;
        // Find the container
        const containerParent = outermost.querySelector('main');
        if (!containerParent) {
            throw new TypeError;
        }

        // Refresh the data upon learning that there might be something new
        const doRefresh = () => {
            // Even recreate the parent for simplicity
            // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
            this.container?.remove();
            const container = this.container = document.createElement('section');
            // Readd the cards
            for (const id of warehouse.getListing(settings.qualities.getValue(), settings.category.getValue())) {
                // Create each card
                const product = warehouse.getItem(id);
                const card = createCard(product.displayName, product.cents, product.imageURL);
                // Wire the card
                (x => {
                    card.onclick = () => {
                        stateMachine.details(x);
                    };
                })(id);
                // Commit
                container.appendChild(card);
            }
            containerParent.appendChild(container);
        };
        warehouse.onChange = doRefresh;
        settings.qualities.addListener(doRefresh);
        settings.category.addListener(doRefresh);
    }
}
