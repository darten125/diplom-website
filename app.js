const BASE_URL = "https://diplombackend-production.up.railway.app";

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    container.removeChild(toast);
  }, 3000);
}

document.getElementById("updateProfessorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${BASE_URL}/update-professor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const resultText = await response.text();
    showToast(resultText);
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

document.getElementById("deleteProfessorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${BASE_URL}/delete-professor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const resultText = await response.text();
    showToast(resultText);
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

const authorsContainer = document.getElementById("authorsContainer");
const addAuthorButton = document.getElementById("addAuthorButton");

function createAuthorBlock(index) {
  const div = document.createElement("div");
  div.className = "author";
  div.innerHTML = `
    <h3>Автор ${index}</h3>
    <label>Имя:
      <input type="text" name="authorName" required>
    </label><br>
    <label>Должность:
      <input type="text" name="authorPosition" required>
    </label><br>
    <label>Кафедра:
      <input type="text" name="authorDepartment" required>
    </label><br>
    <button type="button" class="removeAuthorBtn">X</button>
  `;
  return div;
}

function refreshAuthorsIndexes() {
  const authorDivs = authorsContainer.querySelectorAll(".author");
  authorDivs.forEach((authorDiv, i) => {
    const h3 = authorDiv.querySelector("h3");
    h3.textContent = `Автор ${i + 1}`;
  });
}

function addAuthor() {
  const index = authorsContainer.querySelectorAll(".author").length + 1;
  const authorDiv = createAuthorBlock(index);
  authorsContainer.appendChild(authorDiv);

  authorDiv.querySelector(".removeAuthorBtn").addEventListener("click", () => {
    authorsContainer.removeChild(authorDiv);
    refreshAuthorsIndexes();
  });
}

addAuthor();

addAuthorButton.addEventListener("click", () => {
  addAuthor();
});

function getAuthorsData() {
  const authorDivs = authorsContainer.querySelectorAll(".author");
  let authors = [];
  authorDivs.forEach(div => {
    const name = div.querySelector("input[name='authorName']").value.trim();
    const position = div.querySelector("input[name='authorPosition']").value.trim();
    const department = div.querySelector("input[name='authorDepartment']").value.trim();
    if (name && position && department) {
      authors.push({ name, position, department });
    }
  });
  return authors;
}

document.getElementById("addArticleForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const title = formData.get("title").trim();
  const link = formData.get("link").trim();

  const authors = getAuthorsData();
  const data = { title, link, authors };

  try {
    const response = await fetch(`${BASE_URL}/add-new-article`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const resultText = await response.text();
    showToast(resultText);
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

const prevThesesFileInput = document.getElementById("previousThesesFileInput");
const prevThesesFileNameSpan = document.getElementById("previousThesesFileName");

prevThesesFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    prevThesesFileNameSpan.innerText = file.name;
  } else {
    prevThesesFileNameSpan.innerText = "";
  }
});

document.getElementById("sendPreviousThesesButton").addEventListener("click", async () => {
  const file = prevThesesFileInput.files[0];
  if (!file) {
    showToast("Выберите файл!");
    return;
  }
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/push-previous-theses`, {
      method: "POST",
      body: formData
    });
    const resultText = await response.text();
    showToast(resultText);
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

document.getElementById("getPendingRequestsButton").addEventListener("click", async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-pending-requests-list`);
    if (!response.ok) {
      const textError = await response.text();
      showToast("Ошибка: " + textError);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pending_supervision_requests.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("Файл загружен");
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

const processedRequestsFileInput = document.getElementById("processedRequestsFileInput");
const processedRequestsFileNameSpan = document.getElementById("processedRequestsFileName");

processedRequestsFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    processedRequestsFileNameSpan.innerText = file.name;
  } else {
    processedRequestsFileNameSpan.innerText = "";
  }
});

document.getElementById("sendProcessedRequestsButton").addEventListener("click", async () => {
  const file = processedRequestsFileInput.files[0];
  if (!file) {
    showToast("Выберите файл!");
    return;
  }
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/push-processed_requests`, {
      method: "POST",
      body: formData
    });
    const resultText = await response.text();
    showToast(resultText);
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

document.getElementById("getAllCurrentThesesButton").addEventListener("click", async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-all-current-theses`);
    if (!response.ok) {
      const textError = await response.text();
      showToast("Ошибка: " + textError);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "current_theses.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("Файл загружен");
  } catch (error) {
    showToast("Ошибка: " + error);
  }
});

