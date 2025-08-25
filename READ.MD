# Technical Assessment Details Avex

## Dependencies

None Just Shopify Dawn Theme Version 15.4

## The Client Story

As a Shopify store owner, I want the ability to add custom labels on a product variant level so that I can highlight specific details.

## Client Documentation

- Editing and Updating Product Varian.✅

  - Go to **Product -> Choose any product -> Scroll down to the Variant Section --> Click on Any of the Variants** -> Edit the text, color and background color of the label. Don't forget to click save after you're done Editing. You can use this same approach to edit or update every single custom label as you see fit.

- Custom Labels on the PDP

  - Go to **Customize -> Click on a Product -> You should see the label ->** Click through the different variants and each variant should have its own custom label.
  - If you don't see custom labels that means it wasn't filled in the Shopify Admin in that case refer to the step above.

- Custom Labels on the Feature Collection or Collection page
  - For **Feature Collection** go to--> Customize -> Feature Collection -> Variant Labels
  - For **Collection Page** go to --> Customize -> Collection Page -> Product Grid

## Developer Documentation

below are the main files that are used to build the product card.

### For all custom product label related settings focus on these files below

#### for the setting code i build "type": "custom_product_label" you should be able to find it easily

- `main-product.liquid`
- `custom-product-label.liquid`
- `sections/main-collection-product-grid.liquid`
- `sections/featured-collection.liquid`
- `snippets/card-product.liquid`
- `component-price.css`
- `section-main-products.css`

### this code for the variant swatches

- `snippets/card-variant-label.liquid`
- `assets/color-variant-display.js`
- `assets/component-color-swatches.css`
- `assets/base.css`
