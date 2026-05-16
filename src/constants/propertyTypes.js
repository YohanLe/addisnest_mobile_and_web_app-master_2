/**
 * Property Types Constants
 * --------------------------------------------------------------
 * Central source of truth for property type, rental type, and
 * property status options used across:
 *   - Property listing form
 *   - Property edit form
 *   - Property list / search filters
 *
 * REVERSAL INSTRUCTIONS
 * --------------------------------------------------------------
 * To revert to the previous (legacy) limited property types list,
 * simply set the flag below to `true`. All consumers that import
 * from this module will fall back to the original options.
 *
 *     export const REVERT_TO_LEGACY_PROPERTY_TYPES = true;
 *
 * No other code changes are required to roll back.
 */

export const REVERT_TO_LEGACY_PROPERTY_TYPES = false;

// ---------------------------------------------------------------
// New (extended) definitions provided by product spec
// ---------------------------------------------------------------
export const PROPERTY_TYPE_DEFINITIONS = {
    Residential: [
        'House',
        'Villa',
        'Apartment',
        'Condominium',
        'Studio',
        'Duplex'
    ],
    Commercial: [
        'Office',
        'Shop',
        'Warehouse',
        'Hotel',
        'Restaurant'
    ],
    Land: [
        'Residential Land',
        'Commercial Land',
        'Farm Land'
    ],
    Rental: [
        'Room',
        'Shared Apartment',
        'Short-Term Rental',
        'Vacation Rental',
        'Furnished Short-Term',
        'Hotel',
        'Airbnb',
        'Guesthouse'
    ],
    rentalType: [
        'Long-Term',
        'Short-Term',
        'Daily',
        'Monthly'
    ],
    propertyStatus: [
        'New Construction',
        'Under Construction',
        'Ready'
    ]
};

// ---------------------------------------------------------------
// Legacy (original) lists used before this change. These are
// preserved so we can fully revert by toggling the flag above.
// ---------------------------------------------------------------
const LEGACY_PROPERTY_TYPE_OPTIONS = [
    { value: 'House', label: 'House' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Villa', label: 'Villa' }
];

const LEGACY_FILTER_PROPERTY_TYPES = [
    { value: 'all', label: 'All Types' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'House', label: 'House' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Land', label: 'Land' }
];

// ---------------------------------------------------------------
// Helpers to build option arrays. We de-duplicate values across
// categories (e.g. "Hotel" appears in both Commercial and Rental)
// while still tagging them with their parent category.
// ---------------------------------------------------------------
const toOption = (value, category) => ({
    value,
    label: value,
    category
});

const buildFlatOptions = (categories) => {
    const seen = new Set();
    const list = [];
    categories.forEach((cat) => {
        (PROPERTY_TYPE_DEFINITIONS[cat] || []).forEach((v) => {
            if (!seen.has(v)) {
                seen.add(v);
                list.push(toOption(v, cat));
            }
        });
    });
    return list;
};

const buildGroupedOptions = (categories) =>
    categories.map((cat) => ({
        label: cat,
        options: (PROPERTY_TYPE_DEFINITIONS[cat] || []).map((v) => toOption(v, cat))
    }));

// ---------------------------------------------------------------
// New option arrays (consumed by forms / filters)
// ---------------------------------------------------------------

// All property types - used in the property listing form / edit form
const NEW_PROPERTY_TYPE_OPTIONS_ALL = buildFlatOptions([
    'Residential',
    'Commercial',
    'Land',
    'Rental'
]);

// For-Sale specific options (Residential, Commercial, Land)
const NEW_PROPERTY_TYPE_OPTIONS_FOR_SALE = buildFlatOptions([
    'Residential',
    'Commercial',
    'Land'
]);

// For-Rent specific options (Residential + Rental + a few commercial)
const NEW_PROPERTY_TYPE_OPTIONS_FOR_RENT = buildFlatOptions([
    'Residential',
    'Rental',
    'Commercial'
]);

// Grouped (react-select supports option groups) - "all" + offering-specific
const NEW_PROPERTY_TYPE_OPTIONS_GROUPED = buildGroupedOptions([
    'Residential',
    'Commercial',
    'Land',
    'Rental'
]);

const NEW_PROPERTY_TYPE_OPTIONS_GROUPED_FOR_SALE = buildGroupedOptions([
    'Residential',
    'Commercial',
    'Land'
]);

const NEW_PROPERTY_TYPE_OPTIONS_GROUPED_FOR_RENT = buildGroupedOptions([
    'Residential',
    'Rental',
    'Commercial'
]);

// Search/filter dropdown - flat list with leading "All Types"
const NEW_FILTER_PROPERTY_TYPES = [
    { value: 'all', label: 'All Types' },
    ...NEW_PROPERTY_TYPE_OPTIONS_ALL.map(({ value, label }) => ({ value, label }))
];

// Rental type & property status options (always available)
export const RENTAL_TYPE_OPTIONS = PROPERTY_TYPE_DEFINITIONS.rentalType.map(
    (v) => ({ value: v, label: v })
);

export const PROPERTY_STATUS_OPTIONS = PROPERTY_TYPE_DEFINITIONS.propertyStatus.map(
    (v) => ({ value: v, label: v })
);

export const FILTER_RENTAL_TYPE_OPTIONS = [
    { value: 'any', label: 'Any' },
    ...RENTAL_TYPE_OPTIONS
];

export const FILTER_PROPERTY_STATUS_OPTIONS = [
    { value: 'any', label: 'Any' },
    ...PROPERTY_STATUS_OPTIONS
];

// ---------------------------------------------------------------
// Public exports - switch between new and legacy via the flag
// ---------------------------------------------------------------
export const PROPERTY_TYPE_OPTIONS = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? LEGACY_PROPERTY_TYPE_OPTIONS
    : NEW_PROPERTY_TYPE_OPTIONS_ALL;

export const PROPERTY_TYPE_OPTIONS_FOR_SALE = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? LEGACY_PROPERTY_TYPE_OPTIONS
    : NEW_PROPERTY_TYPE_OPTIONS_FOR_SALE;

export const PROPERTY_TYPE_OPTIONS_FOR_RENT = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? LEGACY_PROPERTY_TYPE_OPTIONS
    : NEW_PROPERTY_TYPE_OPTIONS_FOR_RENT;

export const PROPERTY_TYPE_OPTIONS_GROUPED = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? [{ label: 'Property Types', options: LEGACY_PROPERTY_TYPE_OPTIONS }]
    : NEW_PROPERTY_TYPE_OPTIONS_GROUPED;

export const PROPERTY_TYPE_OPTIONS_GROUPED_FOR_SALE = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? [{ label: 'Property Types', options: LEGACY_PROPERTY_TYPE_OPTIONS }]
    : NEW_PROPERTY_TYPE_OPTIONS_GROUPED_FOR_SALE;

export const PROPERTY_TYPE_OPTIONS_GROUPED_FOR_RENT = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? [{ label: 'Property Types', options: LEGACY_PROPERTY_TYPE_OPTIONS }]
    : NEW_PROPERTY_TYPE_OPTIONS_GROUPED_FOR_RENT;

export const FILTER_PROPERTY_TYPES = REVERT_TO_LEGACY_PROPERTY_TYPES
    ? LEGACY_FILTER_PROPERTY_TYPES
    : NEW_FILTER_PROPERTY_TYPES;

// Convenience: pick options by offering type (flat list)
export const getPropertyTypeOptionsForOffering = (offeringType) => {
    const t = String(offeringType || '').toLowerCase();
    if (t.includes('rent')) return PROPERTY_TYPE_OPTIONS_FOR_RENT;
    if (t.includes('sale') || t.includes('sell') || t.includes('buy')) {
        return PROPERTY_TYPE_OPTIONS_FOR_SALE;
    }
    return PROPERTY_TYPE_OPTIONS;
};

// Convenience: pick GROUPED options by offering type. Use this in
// react-select to show category headers (Residential, Commercial, Land,
// Rental) above their items.
export const getGroupedPropertyTypeOptionsForOffering = (offeringType) => {
    const t = String(offeringType || '').toLowerCase();
    if (t.includes('rent')) return PROPERTY_TYPE_OPTIONS_GROUPED_FOR_RENT;
    if (t.includes('sale') || t.includes('sell') || t.includes('buy')) {
        return PROPERTY_TYPE_OPTIONS_GROUPED_FOR_SALE;
    }
    return PROPERTY_TYPE_OPTIONS_GROUPED;
};

export default {
    REVERT_TO_LEGACY_PROPERTY_TYPES,
    PROPERTY_TYPE_DEFINITIONS,
    PROPERTY_TYPE_OPTIONS,
    PROPERTY_TYPE_OPTIONS_FOR_SALE,
    PROPERTY_TYPE_OPTIONS_FOR_RENT,
    PROPERTY_TYPE_OPTIONS_GROUPED,
    PROPERTY_TYPE_OPTIONS_GROUPED_FOR_SALE,
    PROPERTY_TYPE_OPTIONS_GROUPED_FOR_RENT,
    FILTER_PROPERTY_TYPES,
    RENTAL_TYPE_OPTIONS,
    PROPERTY_STATUS_OPTIONS,
    FILTER_RENTAL_TYPE_OPTIONS,
    FILTER_PROPERTY_STATUS_OPTIONS,
    getPropertyTypeOptionsForOffering,
    getGroupedPropertyTypeOptionsForOffering
};
