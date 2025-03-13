function setButtonText(
  button,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save"
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;
  setButtonText(submitButton, true, loadingText, defaultText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)

    .finally(() => {
      setButtonText(submitButton, false, loadingText, defaultText);
    });
}
