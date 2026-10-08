import { diagramRendererModuleUrl } from '@params';

// Memoize the renderer module import.
let rendererPromise = null;

export default function Diagram({ component }) {
  if (!rendererPromise) {
    if (!diagramRendererModuleUrl) {
      console.error('Diagram renderer module URL is not configured.');
      return;
    }
    rendererPromise = import(diagramRendererModuleUrl);
  }
  rendererPromise
    .then(({ default: renderer }) => {
      // Configure mermaid with InfluxData theming
      renderer.initialize({
        startOnLoad: false, // We'll manually call run()
        theme: document.body.classList.contains('dark-theme')
          ? 'dark'
          : 'default',
        themeVariables: {
          fontFamily: 'Proxima Nova',
          fontSize: '16px',
          lineColor: '#22ADF6',
          primaryColor: '#22ADF6',
          primaryTextColor: '#545454',
          secondaryColor: '#05CE78',
          tertiaryColor: '#f4f5f5',
        },
        securityLevel: 'loose', // Required for interactive diagrams
        logLevel: 'error',
      });

      // Process the specific diagram component
      try {
        renderer.run({ nodes: [component] });
      } catch (error) {
        console.error('Diagram rendering error:', error);
      }

      // Store reference to the renderer for theme switching.
      if (!window.diagramRendererInstances) {
        window.diagramRendererInstances = new Map();
      }
      window.diagramRendererInstances.set(component, renderer);
    })
    .catch((error) => {
      console.error('Failed to load Mermaid library:', error);
    });

  // Listen for theme changes to refresh diagrams
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.attributeName === 'class' &&
        document.body.classList.contains('dark-theme') !== window.isDarkTheme
      ) {
        window.isDarkTheme = document.body.classList.contains('dark-theme');

        // Reload this specific diagram with new theme
        if (window.diagramRendererInstances?.has(component)) {
          const renderer = window.diagramRendererInstances.get(component);
          renderer.initialize({
            theme: window.isDarkTheme ? 'dark' : 'default',
          });
          renderer.run({ nodes: [component] });
        }
      }
    });
  });

  // Watch for theme changes on body element
  observer.observe(document.body, { attributes: true });

  // Return cleanup function to be called when component is destroyed
  return () => {
    observer.disconnect();
    if (window.diagramRendererInstances?.has(component)) {
      window.diagramRendererInstances.delete(component);
    }
  };
}
