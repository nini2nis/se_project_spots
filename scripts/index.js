const initialCards = [
  {
    name: "Venice, Italy",
    link: "https://images.unsplash.com/photo-1519112232436-9923c6ba3d26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Mt. Fuji, Japan",
    link: "https://images.unsplash.com/photo-1734249201319-e7227b1b4f54?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "London, United Kingdom",
    link: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Taj Majal (Agra), India",
    link: "https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Cappadocia, Turkey",
    link: "https://images.unsplash.com/photo-1732951362119-3037a2d960b3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Copenhagen, Denmark",
    link: "https://images.unsplash.com/photo-1733235015010-bf15b2af1422?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Golden Gate Bridge (San Francisco), USA",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const editProfileButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const profileNameInput = editModal.querySelector("#profile-name");
const profileDescriptionInput = editModal.querySelector("#profile-description");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Add Card Modal
const addCardButton = document.querySelector(".profile__post-button");
const addCardModal = document.querySelector("#post-modal");
const addCardElement = addCardModal.querySelector(".modal__form");
const addCardCloseButton = addCardModal.querySelector(".modal__close-button");
const cardLinkInput = addCardModal.querySelector("#card-link");
const cardNameInput = addCardModal.querySelector("#card-name");
const modalPreview = document.querySelector("#modal-preview");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardImage = cardsList.querySelector("card__image");
const closeModalPreviewButton = document.querySelector(
  ".modal__close-button-white"
);

function getCardElement(data) {
  console.log(data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardName = cardElement.querySelector(".card__text");
  const cardImage = cardElement.querySelector(".card__image");
  const heartButton = cardElement.querySelector(".card__heart-button");
  const trashButton = cardElement.querySelector(".card__trash-button");

  cardName.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  heartButton.addEventListener("click", () => {
    heartButton.classList.toggle("card__heart-button_liked");
  });

  trashButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    const modalImageName = modalPreview.querySelector(".modal__image-name");
    const modalImage = modalPreview.querySelector(".modal__image");
    openModal(modalPreview);
    modalImageName.textContent = data.name;
    modalImage.src = data.link;
    modalImage.alt = data.name;
    return cardElement;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(editModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(addCardModal);
}

editProfileButton.addEventListener("click", () => {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

addCardCloseButton.addEventListener("click", () => {
  closeModal(addCardModal);
});

closeModalPreviewButton.addEventListener("click", () => {
  closeModal(modalPreview);
});

editFormElement.addEventListener("submit", handleProfileFormSubmit);
addCardElement.addEventListener("submit", handleCardFormSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
