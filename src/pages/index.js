/*   HTML & CSS MODULE IMPORTS     */

import "./index.css";

import logoSrc from "../images/logo.svg";
const logoImage = document.getElementById("header__logo");
logoImage.src = logoSrc;

import penSrc from "../images/icon_pen.svg";
const penImage = document.getElementById("profile__edit-icon");
penImage.src = penSrc;

import plusSrc from "../images/icon_plus.svg";
const plusImage = document.getElementById("profile__post-icon");
plusImage.src = plusSrc;

/*    JS MODULE IMPORTS          */
import Api from "../utils/Api.js";

import { handleSubmit } from "../utils/Helpers.js";

import {
  settings,
  resetValidation,
  disableButton,
  enableValidation,
} from "../scripts/validation.js";

/*  AVATAR SELECTORS     */
const avatarImage = document.getElementById("profile__avatar");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["edit-avatar"];
const avatarEditBtn = document.querySelector(".profile__avatar-btn");
const avatarLinkInput = avatarModal.querySelector("#avatar-link");

/*   PROFILE SELECTORS    */
const editProfileButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector("#edit-modal");
const profileForm = document.forms["edit-profile"];
const profileNameInput = editModal.querySelector("#profile-name");
const profileDescriptionInput = editModal.querySelector("#profile-description");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

/*   CARD SELECTORS     */
const addCardButton = document.querySelector(".profile__post-button");
const addCardModal = document.querySelector("#post-modal");
const cardForm = document.forms["new-post-form"];
const cardLinkInput = addCardModal.querySelector("#card-link");
const cardNameInput = addCardModal.querySelector("#card-name");
const cardSubmitButton = addCardModal.querySelector(".modal__submit-button");
const cardsList = document.querySelector(".cards__list");

/*   MODAL & TEMPLATE SELECTORS     */
const popups = document.querySelectorAll(".modal");
const cardTemplate = document.querySelector("#card-template");

/*   IMAGE MODAL SELECTORS   */
const modalPreview = document.querySelector("#modal-preview");
const modalImageName = modalPreview.querySelector(".modal__image-name");
const modalImage = modalPreview.querySelector(".modal__image");

/*    DELETE MODAL SELECTORS    */
const modalDelete = document.querySelector("#modal-delete");
const deleteForm = modalDelete.querySelector(".modal__form");
const deleteSubmitButton = modalDelete.querySelector(".modal__submit-button");
const cancelModalButton = document.querySelector(".modal__cancel-button");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "cb408f20-cef0-4ee4-a289-c2194b9dd6d5",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
    cards.forEach((item) => {
      renderCard(item, "append");
    });
  })
  .catch((err) => {
    console.error(err);
  });

function handleProfileFormSubmit(evt) {
  // create a request function that returns a promise
  function editUserInfo() {
    // `return` lets us use a promise chain `then, catch, finally`
    return api
      .editUserInfo({
        name: profileNameInput.value,
        about: profileDescriptionInput.value,
      })
      .then((data) => {
        profileName.textContent = data.name;
        profileDescription.textContent = data.about;
        closeModal(editModal);
      });
  }
  // here we call handleSubmit passing the request and event (if you want a different loading text then you need to pass the 3rd param)
  handleSubmit(editUserInfo, evt);
}

function handleAvatarFormSubmit(evt) {
  function editAvatar() {
    return api
      .editAvatar({
        avatar: avatarLinkInput.value,
      })
      .then((data) => {
        avatarImage.src = data.avatar;
        disableButton(deleteSubmitButton, settings);
        closeModal(avatarModal);
      });
  }
  handleSubmit(editAvatar, evt);
}

function handleCardFormSubmit(evt) {
  function addNewCard() {
    return api
      .addNewCard({
        name: cardNameInput.value,
        link: cardLinkInput.value,
      })
      .then((cardData) => {
        const cardElement = getCardElement(cardData);
        cardsList.prepend(cardElement);
        disableButton(cardSubmitButton, settings);
        closeModal(addCardModal);
      });
  }
  handleSubmit(addNewCard, evt);
}

let selectedCard;
let selectedCardId;

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

  if (data.isLiked) {
    heartButton.classList.toggle("card__heart-button_liked");
  }
  heartButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });
  trashButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );
  cardImage.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__heart-button_liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__heart-button_liked");
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleImageClick(data) {
  openModal(modalPreview);
  modalImageName.textContent = data.name;
  modalImage.src = data.link;
  modalImage.alt = data.name;
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(modalDelete);
}

function handleDeleteSubmit(evt) {
  function removeCard() {
    return api.removeCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(modalDelete);
    });
  }
  handleSubmit(removeCard, evt, "Deleting...");
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeOnEsc);
  document.addEventListener("click", closeOnCancelBtn);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeOnEsc);
  document.removeEventListener("click", closeOnCancelBtn);
}

function closeOnEsc(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    if (activeModal) closeModal(activeModal);
  }
}

function closeOnCancelBtn(evt) {
  if (evt.target === cancelModalButton) {
    const activeModal = document.querySelector(".modal_opened");
    if (activeModal) closeModal(activeModal);
  }
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

editProfileButton.addEventListener("click", () => {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editModal,
    [profileNameInput, profileDescriptionInput],
    settings
  );
  openModal(editModal);
});

avatarEditBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(popup);
    }
    if (evt.target.classList.contains("modal__close-button")) {
      closeModal(popup);
    }
  });
});

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

enableValidation(settings);
