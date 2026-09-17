/* Prototype: no network requests, storage, or collection of personal data. */
const form = document.querySelector('#waitlist-form');
const email = document.querySelector('#email');
const consent = document.querySelector('#consent');
const result = document.querySelector('#signup-result');
const emailError = document.querySelector('#email-error');
const consentError = document.querySelector('#consent-error');
const selectRole = (value) => {
  const option = form.querySelector(`input[name="role"][value="${value}"]`);
  if (option) option.checked = true;
};
document.querySelectorAll('[data-role-target]').forEach(link => {
  link.addEventListener('click', () => {
    if (form.hidden) resetForm();
    selectRole(link.dataset.roleTarget);
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  email.value = email.value.trim();
  const emailValid = email.value.length > 0 && email.validity.valid;
  emailError.textContent = emailValid ? '' : 'Enter a valid email address, such as you@example.com.';
  email.setAttribute('aria-invalid', String(!emailValid));
  consentError.textContent = consent.checked ? '' : 'Please confirm you’d like development and early-access emails.';
  consent.setAttribute('aria-invalid', String(!consent.checked));
  consent.setAttribute('aria-describedby', 'consent-error');
  if (!emailValid) { email.focus(); return; }
  if (!consent.checked) { consent.focus(); return; }
  const role = form.querySelector('input[name="role"]:checked').value;
  const messages = {
    reader: 'As a reader, you would receive development updates and opportunities to try the reading experience early.',
    creator: 'As a creator, you would receive pilot updates and submission information when onboarding opens.',
    both: 'You would receive reader updates, early testing opportunities, and creator pilot information.'
  };
  document.querySelector('#signup-message').textContent = messages[role];
  email.value = ''; // Do not retain the email after demonstrating submission.
  form.hidden = true;
  result.hidden = false;
  result.focus();
});
function resetForm() {
  form.reset();
  form.hidden = false;
  result.hidden = true;
  emailError.textContent = '';
  consentError.textContent = '';
  email.removeAttribute('aria-invalid');
  consent.removeAttribute('aria-invalid');
  document.querySelector('#format-interest').selectedIndex = 0;
  document.querySelector('.optional-question').open = false;
}
document.querySelector('#reset-signup').addEventListener('click', () => { resetForm(); email.focus(); });
// Wait for local fonts before positioning a directly linked section.
// This also keeps the brand guide's signup iframe on the intended section.
if (location.hash) {
  document.fonts.ready.then(() => {
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
}
