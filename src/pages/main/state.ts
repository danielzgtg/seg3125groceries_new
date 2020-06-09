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
        return dest instanceof SettingsState || dest instanceof CheckoutState;
    }
}

/**
 * Checking out and reviewing before making a purchase in "checkout".
 */
export class CheckoutState extends MainPageStateBase {
    canTransitionFrom(src: MainPageState): boolean {
        return src instanceof SalesFloorState;
    }

    canTransitionTo(dest: MainPageState): boolean {
        return dest instanceof SalesFloorState || dest instanceof ProcessingState;
    }
}

/**
 * Setting search filters in "settings" to see their effect in the listing.
 */
export class SettingsState extends MainPageStateBase {
    canTransitionFrom(src: MainPageState): boolean {
        return src instanceof SalesFloorState;
    }

    canTransitionTo(dest: MainPageState): boolean {
        return dest instanceof SalesFloorState;
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

export type MainPageState = SalesFloorState | CheckoutState | SettingsState | ProcessingState;

const SALES_FLOOR = new SalesFloorState;
const CHECKOUT = new CheckoutState;
const SETTINGS = new SettingsState;
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

    checkout(): void {
        this.setValue(CHECKOUT);
    }

    settings(): void {
        this.setValue(SETTINGS);
    }

    processing(): void {
        this.setValue(PROCESSING);
    }
}
