document.querySelectorAll('[data-colour]').forEach(button => {
  button.addEventListener('click', async () => {
    const colour = button.dataset.colour;
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(colour);
      status.textContent = `${colour} copied.`;
    } catch {
      status.textContent = `Copy this colour: ${colour}. Clipboard access is unavailable in this preview.`;
    }
  });
});
