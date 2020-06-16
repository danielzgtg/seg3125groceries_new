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

/**
 * Always returns the result of the specified query.
 *
 * If that is not possible, a TypeError is thrown.
 */
export function querySelectorOrThrow<T extends HTMLElement>(
    container: HTMLElement, query: string, type: new() => T,
): T {
    const result = container.querySelector(query);
    if (!(result instanceof type)) {
        throw new TypeError;
    }
    return result;
}

export { Observer, Observable, MutableObservable, State, StateMachine } from './_state';
