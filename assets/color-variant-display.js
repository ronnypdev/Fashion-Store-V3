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

                // Get the variant image URL
                const imageUrl = swatch.dataset.imageUrl;

                if (
                  imageUrl &&
                  imageUrl !== 'undefined' &&
                  !imageUrl.includes('Liquid error')
                ) {
                  this.switchProductImage(card, imageUrl);
                }
              });
            });
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
        return;
      }

      const productImage = card.querySelector('.card__media img');
      if (productImage) {
        // Create a new image element
        const newImage = new Image();

        // Generate srcset for different sizes
        const sizes = [165, 360, 533, 720, 940, 1066];
        const srcset = sizes
          .map((size) => {
            const sizeUrl = imageUrl.replace(/width=\d+/, `width=${size}`);
            return `${sizeUrl} ${size}w`;
          })
          .join(', ');

        newImage.srcset = srcset;
        newImage.sizes =
          '(min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)';
        newImage.src = imageUrl;

        // When the new image is loaded, swap it immediately
        newImage.onload = () => {
          productImage.srcset = srcset;
          productImage.sizes = newImage.sizes;
          productImage.src = imageUrl;
        };

        // Handle image load errors
        newImage.onerror = () => {
          console.error('Failed to load variant image:', imageUrl);
        };
      }
    } catch (error) {
      console.error('Error switching product image:', error);
    }
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
