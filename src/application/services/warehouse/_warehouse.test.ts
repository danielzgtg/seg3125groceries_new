import type { Category, Qualities } from '../../../models';

jest.mock('./_images.ts', () => new Proxy({}, {
    get() {
        return '';
    },
}));

import Warehouse from './index';

it('starts empty', () => {
    const w = new Warehouse;
    expect(w.getListing({}, null)).toMatchObject({});
});

test('refresh works', () => {
    const w = new Warehouse;
    w.refresh();
});

test('all prices are valid', () => {
    const w = new Warehouse;
    w.refresh();
    for (const id of w.getListing({}, null)) {
        expect(w.getItem(id)).toBeTruthy();
    }
});

it('orders prices ascending', () => {
    const w = new Warehouse;
    w.refresh();
    let min = 0;
    for (const id of w.getListing({}, null)) {
        const cur = w.getItem(id);
        expect(cur.cents).toBeGreaterThanOrEqual(min);
        min = cur.cents;
    }
});

/**
 * Sizes the specified listing
 */
function sizeListing(warehouse: Warehouse, qualities: Qualities, category: Category | null): number {
    return warehouse.getListing(qualities, category).length;
}

it('filters', () => {
    const w = new Warehouse;
    w.refresh();
    const base = sizeListing(w, {}, null);

    expect(sizeListing(w, { vegetarian: true }, null)).toBeLessThan(base);
    expect(sizeListing(w, { glutenFree: true }, null)).toBeLessThan(base);
    expect(sizeListing(w, { organic: true }, null)).toBeLessThan(base);
    expect(sizeListing(w, { diabetic: true }, null)).toBeLessThan(base);
    expect(sizeListing(w, { lactoseFree: true }, null)).toBeLessThan(base);

    expect(sizeListing(w, {}, 'fruit')).toBeLessThan(base);
    expect(sizeListing(w, {}, 'vegetable')).toBeLessThan(base);
    expect(sizeListing(w, {}, 'meat')).toBeLessThan(base);
    expect(sizeListing(w, {}, 'dairy')).toBeLessThan(base);
    expect(sizeListing(w, {}, 'bakery')).toBeLessThan(base);
    expect(sizeListing(w, {}, 'pantry')).toBeLessThan(base);
    expect(sizeListing(w, {}, 'drink')).toBeLessThan(base);
});
