// As per designs, every interval column is 113px wide
// @upgrade
// fixed with, as per challenge description: Handle zoom level changes (recalculate column widths)
// need to move this const to the timeline state service and update the value depending on the selected timespan
// then in the components that are  using this size (like the intervals), use the corresponding value. (check also
// scss files ah it is being used there.
export const INTERVAL_WIDTH = 113;