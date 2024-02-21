import { defaultTo } from "cypress/types/lodash";
import { Ref } from "vue";

type FilterOptions = Record<string, any[]>;

/**
 * Updates the filter options.
 *
 * The number of filter options can decrease due to actions against the table.
 * If the new options array is longer, it updates the current options array.
 * This ensures that the number of options only increases or remains the same, but never decreases.
 *
 * @param filterOptions - A filter options Ref object to be updated.
 * @param newOptions - A filter options object containing arrays of new options.
 */
const updateFilterOptions = (filterOptions: Ref<FilterOptions>, newOptions: FilterOptions): void => {
  const filterKeys = Object.keys(newOptions);

  filterKeys.forEach((key) => {
    const oldOptionsLength = filterOptions.value[key]?.length ?? 0;
    const newOptionsLength = newOptions[key]?.length ?? 0;

    if (newOptionsLength > oldOptionsLength) {
      filterOptions.value[key] = newOptions[key];
    }
  });
};

export default updateFilterOptions;