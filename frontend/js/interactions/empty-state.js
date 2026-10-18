export function showEmptyState(state) {
    const panel = document.getElementById('interaction-empty-state');
    panel.hidden = !state;
    if (!state) return;

    panel.querySelector('h2').textContent = state.title;
    panel.querySelector('p').textContent = state.description;
    panel.querySelector('.empty-state-icon img').src = 'assets/status/info-circle-fill.svg';
    const link = panel.querySelector('a');
    const button = panel.querySelector('button');
    link.hidden = !state.href;
    button.hidden = !!state.href || !state.action;
    if (state.href) {
        link.href = state.href;
        link.textContent = state.action;
    } else {
        button.textContent = state.action;
        button.onclick = state.onAction;
    }
}
