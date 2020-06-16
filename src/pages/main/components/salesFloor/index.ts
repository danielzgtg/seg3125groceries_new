import { MainPageStateMachine, SalesFloorState } from '../../state';

/**
 * The sales floor containing the settings and the listing.
 */
export default class SalesFloor {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    constructor(outermost: HTMLElement, stateMachine: MainPageStateMachine) {
        this.outermost = outermost;
        // Just handle the visibility changes
        stateMachine.addListener((src, dest) => {
            outermost.hidden = !(dest instanceof SalesFloorState);
        });
    }
}
