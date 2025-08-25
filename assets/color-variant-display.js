class ColorVariantDisplay {
  constructor() {
    this.init();
  }

  init() {
    try {
      const productCards = document.querySelectorAll(
        '.card-wrapper[data-has-colors="true"]'
      );

      productCards.forEach((card, index) => {
        try {
          const swatches = card.querySelectorAll(
            '.color-swatch:not(.disabled)'
          );

          if (swatches.length > 0) {
            swatches.forEach((swatch) => {
              swatch.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Get the variant image URL
                const imageUrl = swatch.dataset.imageUrl;
                const variantId = swatch.dataset.variantId;
                const hasVariantImage = swatch.dataset.hasVariantImage;

                console.log('Swatch clicked, image URL:', imageUrl);
                console.log('Variant ID:', variantId);
                console.log('Has variant image:', hasVariantImage);
                console.log('Swatch data:', swatch.dataset);

                // Debug: Check what images are currently in the card
                const allImages = card.querySelectorAll('img');
                console.log('All images in card:', allImages);
                allImages.forEach((img, index) => {
                  console.log(`Image ${index}:`, img.src, img.className);
                });

                if (
                  imageUrl &&
                  imageUrl !== 'undefined' &&
                  !imageUrl.includes('Liquid error') &&
                  hasVariantImage === 'true'
                ) {
                  this.switchProductImage(card, imageUrl);

                  // Update selected state
                  this.updateSelectedSwatch(card, swatch);
                } else {
                  console.log('No valid variant image to switch to');
                }
              });
            });

            if (swatches.length > 0) {
              const firstAvailableSwatch = card.querySelector(
                '.color-swatch:not(.disabled)'
              );
              if (firstAvailableSwatch) {
                firstAvailableSwatch.classList.add('selected');
              }
            }
          }
        } catch (cardError) {
          console.error(`Error processing card ${index + 1}:`, cardError);
        }
      });

      // Initialize hover events for all swatches
      this.setupSwatchHoverEvents();
    } catch (error) {
      console.error('Error initializing color variant display:', error);
    }
  }

  setupSwatchHoverEvents() {
    const swatches = document.querySelectorAll('.color-swatch:not(.disabled)');

    swatches.forEach((swatch) => {
      const cardWrapper = swatch.closest('.card-wrapper');
      if (!cardWrapper) return;

      const secondaryImage = cardWrapper.querySelector(
        '.media--hover-effect img:last-child'
      );
      if (!secondaryImage) return;

      const variantImageUrl = swatch.dataset.imageUrl;
      if (
        !variantImageUrl ||
        variantImageUrl === 'undefined' ||
        variantImageUrl.includes('Liquid error')
      )
        return;

      // Store original srcset and src
      const originalSrcset = secondaryImage.srcset;
      const originalSrc = secondaryImage.src;

      swatch.addEventListener('mouseenter', () => {
        // Update secondary image with variant image
        secondaryImage.srcset = '';
        secondaryImage.src = variantImageUrl;
      });

      swatch.addEventListener('mouseleave', () => {
        // Restore original image
        secondaryImage.srcset = originalSrcset;
        secondaryImage.src = originalSrc;
      });
    });
  }

  switchProductImage(card, imageUrl) {
    try {
      if (
        !imageUrl ||
        imageUrl === 'undefined' ||
        imageUrl.includes('Liquid error')
      ) {
        console.log('Invalid image URL:', imageUrl);
        return;
      }

      // Find the main product image - try multiple selectors
      let productImage = card.querySelector(
        '.media--hover-effect img:first-child'
      );

      if (!productImage) {
        productImage = card.querySelector('.card__media-image img:first-child');
      }

      if (!productImage) {
        productImage = card.querySelector('.card__media img:first-child');
      }

      if (!productImage) {
        console.log('Product image not found');
        return;
      }

      console.log('Found product image:', productImage);
      console.log('Current image src:', productImage.src);
      console.log('Switching to image:', imageUrl);

      // Store the original image for fallback
      const originalSrc = productImage.src;
      const originalSrcset = productImage.srcset;

      // Create a new image element for preloading
      const newImage = new Image();

      // Generate srcset for different sizes
      const sizes = [165, 360, 533, 720, 940, 1066];
      const srcset = sizes
        .map((size) => {
          // Handle different URL patterns
          let sizeUrl;
          if (imageUrl.includes('width=')) {
            sizeUrl = imageUrl.replace(/width=\d+/, `width=${size}`);
          } else if (imageUrl.includes('?')) {
            sizeUrl = `${imageUrl}&width=${size}`;
          } else {
            sizeUrl = `${imageUrl}?width=${size}`;
          }
          return `${sizeUrl} ${size}w`;
        })
        .join(', ');

      newImage.srcset = srcset;
      newImage.sizes =
        '(min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)';
      newImage.src = imageUrl;

      // When the new image is loaded, swap it immediately
      newImage.onload = () => {
        console.log('New image loaded successfully');

        // Force the image update by setting attributes in a specific order
        productImage.srcset = srcset;
        productImage.sizes = newImage.sizes;

        // Use a small delay to ensure the srcset is processed
        setTimeout(() => {
          productImage.src = imageUrl;
          console.log('Image switched successfully');
          console.log('New image src:', productImage.src);

          // Force a repaint
          productImage.style.display = 'none';
          productImage.offsetHeight; // Force reflow
          productImage.style.display = '';
        }, 10);
      };

      // Handle image load errors
      newImage.onerror = () => {
        console.error('Failed to load variant image:', imageUrl);
        // Fallback to original image
        productImage.src = originalSrc;
        productImage.srcset = originalSrcset;
      };
    } catch (error) {
      console.error('Error switching product image:', error);
    }
  }

  updateSelectedSwatch(card, selectedSwatch) {
    // Remove selected class from all swatches in this card
    const allSwatches = card.querySelectorAll('.color-swatch');
    allSwatches.forEach((swatch) => {
      swatch.classList.remove('selected');
    });

    // Add selected class to the clicked swatch
    selectedSwatch.classList.add('selected');
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ColorVariantDisplay();
  });
} else {
  new ColorVariantDisplay();
}

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.card__inner').forEach(function (card) {
    // Change cursor on hover
    card.style.cursor = 'pointer';
    // On click, trigger click on .full-unstyled-link inside the card
    card.addEventListener('click', function () {
      const link = card.querySelector('.full-unstyled-link');
      if (link) {
        link.click();
      }
    });
  });
});
// Initialize the functionality
customElements.define(
  'color-variant-display',
  class extends HTMLElement {
    constructor() {
      super();
      new ColorVariantDisplay();
    }
  }
);
