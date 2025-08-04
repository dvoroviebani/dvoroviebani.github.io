
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5IZHD94ixKvzDww2wSnL90MsLVFQUz7o",
  authDomain: "dvoroviebanidatabase.firebaseapp.com",
  projectId: "dvoroviebanidatabase",
  storageBucket: "dvoroviebanidatabase.firebasestorage.app",
  messagingSenderId: "494284822106",
  appId: "1:494284822106:web:cf11d9b40f10a0fd6faa63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "cards", "bonus_cards");

let cards = [];

async function loadCards() {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    cards = docSnap.data().cards || [];
    renderCards();
  }
}

async function saveCards() {
  await setDoc(docRef, { cards });
}

function renderCards() {
  const list = document.getElementById("cardList");
  list.innerHTML = "";
  cards.forEach((card, index) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "card-info";
    info.innerHTML = `<strong>${card.number}</strong><br>${card.owner} — ${card.discount}%`;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";
    delBtn.onclick = async () => {
      cards.splice(index, 1);
      await saveCards();
      renderCards();
    };

    const editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";
    editBtn.className = "edit";
    editBtn.onclick = () => editCard(index);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    li.appendChild(info);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function generateCardNumber() {
  return "BC-" + Math.floor(100000 + Math.random() * 900000);
}

window.addCard = async function () {
  const owner = document.getElementById("ownerName").value;
  const discount = parseInt(document.getElementById("discount").value);
  if (!owner || isNaN(discount)) return alert("Введите имя и скидку");
  const newCard = { number: generateCardNumber(), owner, discount };
  cards.push(newCard);
  await saveCards();
  renderCards();
  document.getElementById("ownerName").value = "";
  document.getElementById("discount").value = "";
};

window.editCard = function (index) {
  const card = cards[index];
  const newOwner = prompt("Новое имя владельца:", card.owner);
  const newDiscount = prompt("Новая скидка (%):", card.discount);
  if (newOwner && !isNaN(parseInt(newDiscount))) {
    cards[index].owner = newOwner;
    cards[index].discount = parseInt(newDiscount);
    saveCards().then(renderCards);
  }
};

window.login = function () {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "1234") {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");
    loadCards();
  } else {
    alert("Неверный логин или пароль");
  }
};
