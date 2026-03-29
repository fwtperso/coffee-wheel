export interface LeafNote {
  id: string;
  label: string;
  color: string;
}

export interface SubCategory {
  id: string;
  label: string;
  notes: LeafNote[];
}

export interface FlavorFamily {
  id: string;
  label: string;
  color: string;
  subCategories: SubCategory[];
}

export const FLAVOR_WHEEL: FlavorFamily[] = [
  {
    id: 'fruity',
    label: 'Fruity',
    color: '#E8472A',
    subCategories: [
      { id: 'berry', label: 'Berry', notes: [
        { id: 'blackberry', label: 'Blackberry', color: '#8B1A4A' },
        { id: 'raspberry', label: 'Raspberry', color: '#C0392B' },
        { id: 'blueberry', label: 'Blueberry', color: '#4A235A' },
        { id: 'strawberry', label: 'Strawberry', color: '#E74C3C' },
      ]},
      { id: 'dried-fruit', label: 'Dried Fruit', notes: [
        { id: 'raisin', label: 'Raisin', color: '#6D3B2E' },
        { id: 'prune', label: 'Prune', color: '#5D2E4B' },
      ]},
      { id: 'citrus', label: 'Citrus Fruit', notes: [
        { id: 'grapefruit', label: 'Grapefruit', color: '#F4A460' },
        { id: 'orange', label: 'Orange', color: '#E67E22' },
        { id: 'lemon', label: 'Lemon', color: '#F1C40F' },
        { id: 'lime', label: 'Lime', color: '#27AE60' },
      ]},
      { id: 'other-fruit', label: 'Other Fruit', notes: [
        { id: 'coconut', label: 'Coconut', color: '#F5CBA7' },
        { id: 'cherry', label: 'Cherry', color: '#C0392B' },
        { id: 'pomegranate', label: 'Pomegranate', color: '#922B21' },
        { id: 'pineapple', label: 'Pineapple', color: '#F9E79F' },
        { id: 'grape', label: 'Grape', color: '#7D3C98' },
        { id: 'apple', label: 'Apple', color: '#A9CCE3' },
        { id: 'peach', label: 'Peach', color: '#F1948A' },
        { id: 'pear', label: 'Pear', color: '#A8D8A8' },
      ]},
    ],
  },
  {
    id: 'floral',
    label: 'Floral',
    color: '#9B59B6',
    subCategories: [
      { id: 'floral-notes', label: 'Floral', notes: [
        { id: 'jasmine', label: 'Jasmine', color: '#D7BDE2' },
        { id: 'rose', label: 'Rose', color: '#F1948A' },
        { id: 'chamomile', label: 'Chamomile', color: '#F9E79F' },
        { id: 'lavender', label: 'Lavender', color: '#BB8FCE' },
      ]},
    ],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    color: '#F39C12',
    subCategories: [
      { id: 'overall-sweet', label: 'Overall Sweet', notes: [
        { id: 'brown-sugar', label: 'Brown Sugar', color: '#D4A574' },
        { id: 'vanilla', label: 'Vanilla', color: '#F5CBA7' },
        { id: 'caramel', label: 'Caramel', color: '#D68910' },
        { id: 'molasses', label: 'Molasses', color: '#6E2C00' },
      ]},
      { id: 'candy', label: 'Candy', notes: [
        { id: 'chocolate', label: 'Chocolate', color: '#6E2C00' },
        { id: 'toffee', label: 'Toffee', color: '#D4AC0D' },
      ]},
    ],
  },
  {
    id: 'nutty-cocoa',
    label: 'Nutty/Cocoa',
    color: '#795548',
    subCategories: [
      { id: 'nutty', label: 'Nutty', notes: [
        { id: 'peanuts', label: 'Peanuts', color: '#C8A97E' },
        { id: 'hazelnut', label: 'Hazelnut', color: '#A0522D' },
        { id: 'almond', label: 'Almond', color: '#D4AC0D' },
      ]},
      { id: 'cocoa', label: 'Cocoa', notes: [
        { id: 'dark-chocolate', label: 'Dark Chocolate', color: '#3E1C00' },
        { id: 'chocolate-notes', label: 'Chocolate', color: '#6E2C00' },
      ]},
    ],
  },
  {
    id: 'spices',
    label: 'Spices',
    color: '#E74C3C',
    subCategories: [
      { id: 'pungent', label: 'Pungent', notes: [
        { id: 'pepper', label: 'Pepper', color: '#E74C3C' },
      ]},
      { id: 'brown-spice', label: 'Brown Spice', notes: [
        { id: 'anise', label: 'Anise', color: '#8E44AD' },
        { id: 'nutmeg', label: 'Nutmeg', color: '#C0392B' },
        { id: 'cinnamon', label: 'Cinnamon', color: '#CA6F1E' },
        { id: 'clove', label: 'Clove', color: '#7B241C' },
      ]},
    ],
  },
  {
    id: 'roasted',
    label: 'Roasted',
    color: '#4A235A',
    subCategories: [
      { id: 'cereal', label: 'Cereal', notes: [
        { id: 'grain', label: 'Grain', color: '#D4AC0D' },
        { id: 'malt', label: 'Malt', color: '#A0522D' },
      ]},
      { id: 'burnt', label: 'Burnt', notes: [
        { id: 'acrid', label: 'Acrid', color: '#1C2833' },
        { id: 'ashy', label: 'Ashy', color: '#808B96' },
        { id: 'smoky', label: 'Smoky', color: '#717D7E' },
        { id: 'brown-roast', label: 'Brown Roast', color: '#4A235A' },
      ]},
      { id: 'tobacco', label: 'Tobacco', notes: [
        { id: 'tobacco-notes', label: 'Tobacco', color: '#6E2C00' },
      ]},
    ],
  },
  {
    id: 'green-vegetative',
    label: 'Green/Veg',
    color: '#27AE60',
    subCategories: [
      { id: 'olive-oil', label: 'Olive Oil', notes: [
        { id: 'olive-oil-note', label: 'Olive Oil', color: '#A9C934' },
      ]},
      { id: 'raw', label: 'Raw', notes: [
        { id: 'raw-note', label: 'Raw', color: '#58D68D' },
      ]},
      { id: 'green-veg', label: 'Green/Veg', notes: [
        { id: 'under-ripe', label: 'Under-ripe', color: '#1E8449' },
        { id: 'peapod', label: 'Peapod', color: '#27AE60' },
        { id: 'fresh', label: 'Fresh', color: '#82E0AA' },
        { id: 'herb', label: 'Herb', color: '#1D8348' },
      ]},
    ],
  },
  {
    id: 'other',
    label: 'Other',
    color: '#7F8C8D',
    subCategories: [
      { id: 'papery-musty', label: 'Papery/Musty', notes: [
        { id: 'stale', label: 'Stale', color: '#AEB6BF' },
        { id: 'cardboard', label: 'Cardboard', color: '#D5D8DC' },
        { id: 'papery', label: 'Papery', color: '#BFC9CA' },
        { id: 'woody', label: 'Woody', color: '#A0522D' },
        { id: 'moldy', label: 'Moldy', color: '#7FB3B3' },
      ]},
      { id: 'chemical', label: 'Chemical', notes: [
        { id: 'rubber', label: 'Rubber', color: '#566573' },
        { id: 'petroleum', label: 'Petroleum', color: '#717D7E' },
        { id: 'medicinal', label: 'Medicinal', color: '#A9CCE3' },
        { id: 'salty', label: 'Salty', color: '#AED6F1' },
        { id: 'sour', label: 'Sour', color: '#F9E79F' },
      ]},
    ],
  },
  {
    id: 'fermented',
    label: 'Fermented',
    color: '#E67E22',
    subCategories: [
      { id: 'winey', label: 'Winey', notes: [
        { id: 'whiskey', label: 'Whiskey', color: '#D4AC0D' },
        { id: 'wine-note', label: 'Wine', color: '#922B21' },
        { id: 'fermented-note', label: 'Fermented', color: '#E67E22' },
      ]},
      { id: 'sour-fermented', label: 'Sour/Fermented', notes: [
        { id: 'sour-note', label: 'Sour', color: '#F1C40F' },
        { id: 'alcohol', label: 'Alcohol/Winey', color: '#A93226' },
        { id: 'overripe', label: 'Overripe', color: '#784212' },
      ]},
    ],
  },
];

export const ALL_NOTES = FLAVOR_WHEEL.flatMap(f =>
  f.subCategories.flatMap(s => s.notes.map(n => ({ ...n, familyId: f.id, subCategoryId: s.id })))
);

export function searchNotes(query: string) {
  const q = query.toLowerCase();
  return ALL_NOTES.filter(n =>
    n.label.toLowerCase().includes(q) ||
    n.id.includes(q)
  );
}
