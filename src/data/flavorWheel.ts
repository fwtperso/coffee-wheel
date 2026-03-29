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
      { id: 'citrus', label: 'Citrus Fruit', notes: [
        { id: 'grapefruit', label: 'Grapefruit', color: '#F4A460' },
        { id: 'orange', label: 'Orange', color: '#E67E22' },
        { id: 'lemon', label: 'Lemon', color: '#F1C40F' },
        { id: 'lime', label: 'Lime', color: '#27AE60' },
      ]},
    ],
  },
  {
    id: 'floral',
    label: 'Floral',
    color: '#D4527A',
    subCategories: [
      { id: 'floral-notes', label: 'Floral', notes: [
        { id: 'black-tea', label: 'Black Tea', color: '#8B4513' },
        { id: 'floral-general', label: 'Floral', color: '#D7BDE2' },
        { id: 'chamomile', label: 'Chamomile', color: '#F9E79F' },
        { id: 'rose', label: 'Rose', color: '#F1948A' },
        { id: 'jasmine', label: 'Jasmine', color: '#D7BDE2' },
      ]},
    ],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    color: '#E8845A',
    subCategories: [
      { id: 'overall-sweet', label: 'Overall Sweet', notes: [
        { id: 'brown-sugar', label: 'Brown Sugar', color: '#D4A574' },
        { id: 'vanilla', label: 'Vanilla', color: '#F5CBA7' },
        { id: 'vanillin', label: 'Vanillin', color: '#E8D5B7' },
        { id: 'overall-sweet-note', label: 'Overall Sweet', color: '#F0C27A' },
      ]},
      { id: 'sweet-aromatics', label: 'Sweet Aromatics', notes: [
        { id: 'sweet-aromatics-note', label: 'Sweet Aromatics', color: '#F5B895' },
      ]},
    ],
  },
  {
    id: 'nutty-cocoa',
    label: 'Nutty/Cocoa',
    color: '#C8924A',
    subCategories: [
      { id: 'nutty', label: 'Nutty', notes: [
        { id: 'almond', label: 'Almond', color: '#D4AC0D' },
        { id: 'hazelnut', label: 'Hazelnut', color: '#A0522D' },
        { id: 'peanuts', label: 'Peanuts', color: '#C8A97E' },
      ]},
      { id: 'cocoa', label: 'Cocoa', notes: [
        { id: 'chocolate', label: 'Chocolate', color: '#6E2C00' },
        { id: 'dark-chocolate', label: 'Dark Chocolate', color: '#3E1C00' },
      ]},
    ],
  },
  {
    id: 'spices',
    label: 'Spices',
    color: '#9B3A3A',
    subCategories: [
      { id: 'pungent', label: 'Pungent', notes: [
        { id: 'pepper', label: 'Pepper', color: '#E74C3C' },
        { id: 'pungent-note', label: 'Pungent', color: '#C0392B' },
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
    color: '#8B7355',
    subCategories: [
      { id: 'cereal', label: 'Cereal', notes: [
        { id: 'malt', label: 'Malt', color: '#A0522D' },
        { id: 'grain', label: 'Grain', color: '#D4AC0D' },
      ]},
      { id: 'burnt', label: 'Burnt', notes: [
        { id: 'brown-roast', label: 'Brown Roast', color: '#4A235A' },
        { id: 'smoky', label: 'Smoky', color: '#717D7E' },
        { id: 'ashy', label: 'Ashy', color: '#808B96' },
        { id: 'acrid', label: 'Acrid', color: '#1C2833' },
      ]},
      { id: 'tobacco', label: 'Tobacco', notes: [
        { id: 'pipe-tobacco', label: 'Pipe Tobacco', color: '#6E2C00' },
        { id: 'tobacco-note', label: 'Tobacco', color: '#8B6914' },
      ]},
    ],
  },
  {
    id: 'other',
    label: 'Other',
    color: '#4AABAB',
    subCategories: [
      { id: 'papery-musty', label: 'Papery/Musty', notes: [
        { id: 'stale', label: 'Stale', color: '#AEB6BF' },
        { id: 'cardboard', label: 'Cardboard', color: '#D5D8DC' },
        { id: 'papery', label: 'Papery', color: '#BFC9CA' },
        { id: 'woody', label: 'Woody', color: '#A0522D' },
        { id: 'moldy-damp', label: 'Moldy/Damp', color: '#7FB3B3' },
        { id: 'musty-dusty', label: 'Musty/Dusty', color: '#A9B2B5' },
        { id: 'musty-earthy', label: 'Musty/Earthy', color: '#8B7D6B' },
      ]},
      { id: 'chemical', label: 'Chemical', notes: [
        { id: 'rubber', label: 'Rubber', color: '#566573' },
        { id: 'skunky', label: 'Skunky', color: '#8B8B00' },
        { id: 'petroleum', label: 'Petroleum', color: '#717D7E' },
        { id: 'medicinal', label: 'Medicinal', color: '#A9CCE3' },
        { id: 'salty', label: 'Salty', color: '#AED6F1' },
        { id: 'bitter', label: 'Bitter', color: '#5D6D7E' },
        { id: 'phenolic', label: 'Phenolic', color: '#8E6B5A' },
      ]},
    ],
  },
  {
    id: 'green-vegetative',
    label: 'Green/Veg',
    color: '#5AAB5A',
    subCategories: [
      { id: 'olive-oil', label: 'Olive Oil', notes: [
        { id: 'olive-oil-note', label: 'Olive Oil', color: '#A9C934' },
      ]},
      { id: 'raw', label: 'Raw', notes: [
        { id: 'raw-note', label: 'Raw', color: '#58D68D' },
      ]},
      { id: 'green-veg', label: 'Green/Vegetative', notes: [
        { id: 'under-ripe', label: 'Under-ripe', color: '#1E8449' },
        { id: 'peapod', label: 'Peapod', color: '#27AE60' },
        { id: 'fresh', label: 'Fresh', color: '#82E0AA' },
        { id: 'dark-green', label: 'Dark Green', color: '#1D6B3A' },
        { id: 'vegetative', label: 'Vegetative', color: '#3DAA3D' },
        { id: 'hay-like', label: 'Hay-like', color: '#C5B358' },
        { id: 'herb-like', label: 'Herb-like', color: '#1D8348' },
        { id: 'beany', label: 'Beany', color: '#8B7D3C' },
      ]},
    ],
  },
  {
    id: 'sour-fermented',
    label: 'Sour/Fermented',
    color: '#8BAB3A',
    subCategories: [
      { id: 'fermented', label: 'Fermented', notes: [
        { id: 'winey', label: 'Winey', color: '#922B21' },
        { id: 'whiskey', label: 'Whiskey', color: '#D4AC0D' },
        { id: 'fermented-note', label: 'Fermented', color: '#8BAB3A' },
        { id: 'overripe', label: 'Overripe', color: '#784212' },
      ]},
    ],
  },
  {
    id: 'sour',
    label: 'Sour',
    color: '#D4C43A',
    subCategories: [
      { id: 'sour-aromatics', label: 'Sour Aromatics', notes: [
        { id: 'sour-aromatics-note', label: 'Sour Aromatics', color: '#D4C43A' },
        { id: 'acetic-acid', label: 'Acetic Acid', color: '#C8B900' },
        { id: 'butyric-acid', label: 'Butyric Acid', color: '#B8A830' },
        { id: 'isovaleric-acid', label: 'Isovaleric Acid', color: '#A89820' },
      ]},
      { id: 'sour-notes', label: 'Sour', notes: [
        { id: 'citric-acid', label: 'Citric Acid', color: '#E8D82A' },
        { id: 'malic-acid', label: 'Malic Acid', color: '#C8D82A' },
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
