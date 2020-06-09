// State machine

/**
 * A listener for state transitions
 */
export type Observer<T> = (src: T, dest: T) => void;

/**
 * The observable pattern
 */
export class Observable<T> {
    /**
     * The wrapped value
     */
    private value: T;

    /**
     * Returns the wrapped value.
     */
    getValue(): T {
        return this.value;
    }

    /**
     * Sets the wrapped value.
     */
    protected setValue(value: T): void {
        // Setter that triggers listeners
        const old = this.value;
        this.value = value;
        for (const listener of this.onceListeners) {
            listener(old, value);
        }
        this.onceListeners = [];
        for (const listener of this.listeners) {
            listener(old, value);
        }
    }

    /**
     * Listeners only registered for the next change
     */
    private onceListeners: Observer<T>[] = [];

    /**
     * Adds a listener for the next change only.
     */
    addOnceListener(listener: Observer<T>): void {
        this.onceListeners.push(listener);
    }

    /**
     * Listeners for changes
     */
    private readonly listeners: Observer<T>[] = [];

    /**
     * Adds a change listener.
     */
    addListener(listener: Observer<T>): void {
        this.listeners.push(listener);
    }

    constructor(state: T) {
        this.value = state;
    }
}

/**
 * A publicly modifiable observable.
 */
export class MutableObservable<T> extends Observable<T> {
    public setValue(value: T): void {
        super.setValue(value);
    }
}

/**
 * A state that is particular with which states it moves to and from.
 */
export interface State<Family extends State<Family>> {
    /**
     * Returns whether the state machine shall be allowed to move from this state to the specified state.
     */
    canTransitionTo(dest: Family): boolean;

    /**
     * Returns whether the state machine shall be allowed to move from the specified state to this state.
     */
    canTransitionFrom(src: Family): boolean;
}

/**
 * A state machine with controlled state transitions.
 */
export class StateMachine<T extends State<T>> extends MutableObservable<T> {
    setValue(value: T): void {
        // Additionally only allow specific state transitions
        const old = this.getValue();
        if (old === value) {
            throw new TypeError;
        }
        if (!value.canTransitionFrom(old)) {
            throw new TypeError;
        }
        if (!old.canTransitionTo(value)) {
            throw new TypeError;
        }
        super.setValue(value);
    }
}
