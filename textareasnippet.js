function autosize(textarea_id, row_limit) {
  // Set default for row_limit parameter
  row_limit = parseInt(row_limit ?? '5');
  if (!row_limit) {
    row_limit = 5;
  }

  // Get the element
  const textarea = document.getElementById(textarea_id);

  // Set required styles for this to function properly.
  textarea.style.setProperty('resize', 'none');
  textarea.style.setProperty('min-height', '0');
  textarea.style.setProperty('max-height', 'none');
  textarea.style.setProperty('height', 'auto');

  // Set rows attribute to number of lines in content
  textarea.oninput = function() {

    // Reset rows attribute to get accurate scrollHeight
    textarea.setAttribute('rows', '1');

    // Get the computed values object reference
    const cs = getComputedStyle(textarea);

    // Force content-box for size accurate line-height calculation
    // Remove scrollbars, lock width (subtract inline padding and inline border widths)
    // and remove inline padding and borders to keep width consistent (for text wrapping accuracy)
    const inline_padding = parseFloat(cs['padding-left']) + parseFloat(cs['padding-right']);
    const inline_border_width = parseFloat(cs['border-left-width']) + parseFloat(cs['border-right-width']);
    textarea.style.setProperty('overflow', 'hidden', 'important');
    textarea.style.setProperty('width', (parseFloat(cs['width']) - inline_padding - inline_border_width) + 'px');
    textarea.style.setProperty('box-sizing', 'content-box');
    textarea.style.setProperty('padding-inline', '0');
    textarea.style.setProperty('border-width', '0');
    
    // Get the base line height, and top / bottom padding.
    const block_padding = parseFloat(cs['padding-top']) + parseFloat(cs['padding-bottom']);
    const line_height =
      // If line-height is not explicitly set, use the computed height value (ignore padding due to content-box)
      cs['line-height'] === 'normal' ? parseFloat(cs['height'])
      // Otherwise (line-height is explicitly set), use the computed line-height value.
      : parseFloat(cs['line-height']);

    // Get the scroll height (rounding to be safe to ensure cross browser consistency)
    const scroll_height = Math.round(textarea.scrollHeight);

    // Undo overflow, width, border-width, box-sizing & inline padding overrides
    textarea.style.removeProperty('width');
    textarea.style.removeProperty('box-sizing');
    textarea.style.removeProperty('padding-inline');
    textarea.style.removeProperty('border-width');
    textarea.style.removeProperty('overflow');

    // Subtract block_padding from scroll_height and divide that by our line_height to get the row count.
    // Round to nearest integer as it will always be within ~.1 of the correct whole number.
    const rows = Math.round((scroll_height - block_padding) / line_height);

    // Set the calculated rows attribute (limited by row_limit)
    textarea.setAttribute("rows", "" + Math.min(rows, row_limit));
  };

  // Trigger the event to set the initial rows value
  textarea.dispatchEvent(new Event('input', {
    bubbles: true
  }));
}
