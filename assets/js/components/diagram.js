export default function Diagram({ component }) {
  // Import mermaid.js module
  import('mermaid').then(({ default: mermaid }) => {
    // Configure mermaid with InfluxData theming
    mermaid.initialize({
      startOnLoad: false, // We'll manually call run()
      theme: document.body.classList.contains('dark-theme') ? 'dark' : 'default',
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
      logLevel: 'error'
    });
    
    // Process the specific diagram component
    try {
      mermaid.run({ nodes: [component] });
    } catch (error) {
      console.error('Mermaid diagram rendering error:', error);
    }
    
    // Store reference to mermaid for theme switching
    if (!window.mermaidInstances) {
      window.mermaidInstances = new Map();
    }
    window.mermaidInstances.set(component, mermaid);
  }).catch(error => {
    console.error('Failed to load Mermaid library:', error);
  });
  
  // Listen for theme changes to refresh diagrams
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && 
          document.body.classList.contains('dark-theme') !== window.isDarkTheme) {
        window.isDarkTheme = document.body.classList.contains('dark-theme');
        
        // Reload this specific diagram with new theme
        if (window.mermaidInstances?.has(component)) {
          const mermaid = window.mermaidInstances.get(component);
          mermaid.initialize({
            theme: window.isDarkTheme ? 'dark' : 'default'
          });
          mermaid.run({ nodes: [component] });
        }
      }
    });
  });
  
  // Watch for theme changes on body element
  observer.observe(document.body, { attributes: true });
  
  // Return cleanup function to be called when component is destroyed
  return () => {
    observer.disconnect();
    if (window.mermaidInstances?.has(component)) {
      window.mermaidInstances.delete(component);
    }
  };
}
