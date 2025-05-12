export default function Diagram({ component }) {
  // Only load mermaid when diagrams are present
  const hasDiagrams = document.querySelectorAll('.mermaid').length > 0;
  
  if (hasDiagrams) {
    import("mermaid").then(({ mermaid }) => {
      mermaid.initialize({
        startOnLoad: true,
        themeVariables: {
          fontFamily: "Proxima Nova",
          fontSize: '18px',
        }
      });
      mermaid.run();
    });
  }
}
