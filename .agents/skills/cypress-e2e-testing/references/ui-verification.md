# Rendered UI verification

Before adding UI assets, search existing icons, components, styles, and tokens.
Record what you will reuse or why the existing assets do not meet the requirement.

## Inspect the rendered result

Define acceptance criteria before capturing screenshots.
Inspect each image for readable labels, unintended truncation, overlap, contrast,
and touch-target size against the project's accessibility requirements.
Record the result for each criterion and fix visible defects before accepting the UI.
A screenshot is evidence collection; its existence alone does not establish a pass.

## Exercise available component widths

Test the width available to the component as well as the viewport width.
Include mobile, tablet, and desktop views, fullscreen and narrow desktop sidebar
layouts where supported, populated header actions, and transitions while resizing.
Check headings and controls at the narrowest supported component width.
Record the component width and layout with each artifact so a wide viewport cannot
hide a constrained container.

## Verify shadow-root styles and fonts

For framework or vendor adapters that render inside a shadow root, inspect which
styles and font resources are available there.
Check the browser's rendered-font information and loaded font resources, then
inspect the actual glyph in the rendered component.
A class name or computed `font-family` alone does not prove that the intended font
or icon glyph loaded.
