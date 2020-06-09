/**
 * Renders a price in cents so that it can be displayed as a dollar.
 */
export function renderPrice(cents: number): string {
    return (cents / 100).toFixed(2);
}

/**
 * Always returns the element with the specified ID and type.
 *
 * If none can be found, a TypeError is thrown.
 */
export function findOrThrow<T>(container: HTMLElement, id: string, type: new () => T): T {
    const result = document.getElementById(id);
    if (!container.contains(result)) {
        throw new TypeError;
    }
    if (result instanceof type) {
        return result;
    }
    throw new TypeError;
}

export { Observer, Observable, MutableObservable, State, StateMachine } from './_state';
