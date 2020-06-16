import type { Category, Qualities } from '../../../../models';
import { findOrThrow, MutableObservable, Observable } from '../../../../utils';

function bindCategory(
    outermost: HTMLElement, observable: MutableObservable<Category | null>,
    id: string, category: Category | null,
) {
    const elem = findOrThrow(outermost, id, HTMLInputElement);
    elem.onclick = () => {
        observable.setValue(category);
    };
    observable.addListener((src, dest) => {
        if (dest === category) {
            elem.checked = true;
        }
    });
}

/**
 * A menu to configure personal preferences.
 */
export default class Settings {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    /**
     * The user's preferences
     */
    readonly qualities: Observable<Qualities>;

    /**
     * The selected category.
     */
    readonly category: MutableObservable<Category | null>;

    constructor(outermost: HTMLElement) {
        this.outermost = outermost;
        const qualities = this.qualities = new MutableObservable<Qualities>({});
        const category = this.category = new MutableObservable<Category | null>(null);

        // Find the checkboxes
        const vegetarian = findOrThrow(outermost, 'vegetarian', HTMLInputElement);
        const glutenFree = findOrThrow(outermost, 'gluten-free', HTMLInputElement);
        const organic = findOrThrow(outermost, 'organic', HTMLInputElement);
        const diabetic = findOrThrow(outermost, 'diabetic', HTMLInputElement);
        const lactoseFree = findOrThrow(outermost, 'lactose-free', HTMLInputElement);
        // Wire them
        const refreshQualities = () => {
            qualities.setValue({
                vegetarian: vegetarian.checked,
                glutenFree: glutenFree.checked,
                organic: organic.checked,
                diabetic: diabetic.checked,
                lactoseFree: lactoseFree.checked,
            });
        };
        vegetarian.onchange = refreshQualities;
        glutenFree.onchange = refreshQualities;
        organic.onchange = refreshQualities;
        diabetic.onchange = refreshQualities;
        lactoseFree.onchange = refreshQualities;

        // Setup the category stuff
        bindCategory(outermost, category, 'category0', null);
        bindCategory(outermost, category, 'category1', 'fruit');
        bindCategory(outermost, category, 'category2', 'vegetable');
        bindCategory(outermost, category, 'category3', 'meat');
        bindCategory(outermost, category, 'category4', 'dairy');
        bindCategory(outermost, category, 'category5', 'bakery');
        bindCategory(outermost, category, 'category6', 'pantry');
        bindCategory(outermost, category, 'category7', 'drink');
    }
}
