export default function AskAITrigger({ element }) {
  const thirdpartyContainer = document.querySelector('#kapa-widget-container');

  if (!element && !thirdpartyContainer) {
    return;
  }

  const triggers = element.getElementsByClassName('ask-ai-open');
  console.log(triggers);
  Array.from(triggers).forEach(trigger => {
    trigger.removeAttribute('style');
  });
}