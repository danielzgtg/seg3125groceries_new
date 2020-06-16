/* eslint-disable no-use-before-define */
import { State, StateMachine } from '../../utils';

abstract class MainPageStateBase implements State<MainPageState> {
    abstract canTransitionFrom(src: MainPageState): boolean;

    abstract canTransitionTo(dest: MainPageState): boolean;
}

/**
 * Browsing the "salesFloor" component at a glance with a huge list of products.
 */
export class SalesFloorState extends MainPageStateBase {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canTransitionFrom(src: MainPageState): boolean {
        return true;
    }

    canTransitionTo(dest: MainPageState): boolean {
        return dest instanceof DetailsState || dest instanceof CheckoutState;
    }
}

/**
 * Looking at the details of an item.
 */
export class DetailsState extends MainPageStateBase {
    readonly id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }

    canTransitionFrom(src: MainPageState): boolean {
        return src instanceof SalesFloorState;
    }

    canTransitionTo(dest: MainPageState): boolean {
        return dest instanceof SalesFloorState || dest instanceof CheckoutState;
    }
}

/**
 * Checking out and reviewing before making a purchase in "checkout".
 */
export class CheckoutState extends MainPageStateBase {
    canTransitionFrom(src: MainPageState): boolean {
        return src instanceof SalesFloorState || src instanceof DetailsState;
    }

    canTransitionTo(dest: MainPageState): boolean {
        return dest instanceof SalesFloorState || dest instanceof ProcessingState;
    }
}

/**
 * Waiting for payment to complete.
 */
export class ProcessingState extends MainPageStateBase {
    canTransitionFrom(src: MainPageState): boolean {
        return src instanceof CheckoutState;
    }

    canTransitionTo(dest: MainPageState): boolean {
        return dest instanceof SalesFloorState;
    }
}

export type MainPageState = SalesFloorState | DetailsState | CheckoutState | ProcessingState;

const SALES_FLOOR = new SalesFloorState;
const CHECKOUT = new CheckoutState;
const PROCESSING = new ProcessingState;

/**
 * The state machine.
 *
 * On each transition, the rest of the app is brought in line.
 * Available transitions are constrained to design for soundness.
 */
export class MainPageStateMachine extends StateMachine<MainPageState> {
    constructor() {
        super(SALES_FLOOR);
    }

    salesFloor(): void {
        this.setValue(SALES_FLOOR);
    }

    details(id: string): void {
        this.setValue(new DetailsState(id));
    }

    checkout(): void {
        this.setValue(CHECKOUT);
    }

    processing(): void {
        this.setValue(PROCESSING);
    }
}
