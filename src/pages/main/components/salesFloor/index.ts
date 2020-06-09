import { MainPageStateMachine, SalesFloorState } from '../../state';
import type Cart from '../../../../application/services/cart';
import { renderPrice } from '../../../../utils';
import type Settings from '../settings';
import toss from '../../basketball';
import type Warehouse from '../../../../application/services/warehouse';

/**
 * The result of createCard.
 */
interface CreateCardResult {
    /**
     * The card for adding to the DOM
     */
    readonly card: HTMLElement,

    /**
     * The image for making a copy of to animate
     */
    readonly img: HTMLDivElement,
}

/**
 * Creates a deal card with the specified data
 */
function createCard(displayName: string, cents: number, imageURL: string): CreateCardResult {
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
    return { card: result, img };
}

/**
 * The place where trading is done.
 */
export default class SalesFloor {
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
        warehouse: Warehouse, cart: Cart,
        settings: Settings,
        stateMachine: MainPageStateMachine,
    ) {
        this.outermost = outermost;
        // Wire the filter button
        const button = outermost.querySelector('[aria-label]');
        if (!(button instanceof HTMLElement)) {
            throw new TypeError;
        }
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
                const { card, img } = createCard(product.displayName, product.cents, product.imageURL);
                // Wire the card
                card.onclick = () => {
                    toss(img);
                    cart.addItem(id);
                };
                // Commit
                container.appendChild(card);
            }
            containerParent.appendChild(container);
        };
        warehouse.onChange = doRefresh;
        settings.qualities.addListener(doRefresh);
        settings.category.addListener(doRefresh);

        // Settings click
        button.onclick = () => stateMachine.settings();
        stateMachine.addListener((src, dest) => {
            outermost.hidden = !(dest instanceof SalesFloorState);
        });
    }
}
