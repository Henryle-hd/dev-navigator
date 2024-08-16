document.addEventListener("DOMContentLoaded", () => {
  fetchResources();
  setupPagination();
  setupSearch();
});
fetch("nav.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("nav-placeholder").innerHTML = data;
  });

let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = "";
let currentTag = "";
let searchTerm = "";

async function fetchResources() {
  try {
    const response = await fetch(
      `/api/resources?page=${currentPage}&limit=${itemsPerPage}&category=${currentCategory}&tag=${currentTag}`
    );
    const data = await response.json();
    displayResources(data.data);
    updatePagination(data.totalPages);
  } catch (error) {
    console.error("Error fetching resources:", error);
  }
}

function displayResources(resources) {
  const container = document.querySelector(".container");
  container.innerHTML = "";

  if (resources.length < 1) {
    container.innerHTML = `
    <div class="no-result">
    <div class="coverImage">
    <img src='../../white-guy.gif' alt=''/>
    </div>
    <h1>${
      searchTerm
        ? `result for ${searchTerm} not available`
        : `${currentCategory} Not found`
    } </h1>
    </div>
    `;
  } else {
    resources.forEach((resource) => {
      const resourceElement = createResourceElement(resource);
      container.appendChild(resourceElement);
    });
  }
}

function createResourceElement(resource) {
  const box = document.createElement("div");
  box.className = "box";

  const defaultImage = "./default.png";
  const defaultForYoutube = "./youtube-icon.png";

  box.innerHTML = `
    <div class="header">
      <div class="imageAvatar">
        <img 
        src="${
          resource.image ||
          (resource.category === "YouTube Channel"
            ? defaultForYoutube
            : defaultImage)
        }" 
        alt="${resource.title} icon"
        onerror="this.src='${
          resource.category === "YouTube Channel"
            ? defaultForYoutube
            : defaultImage
        }'"/>
      </div>
      <div class="title">
        <a href="${resource.link}">
          <h2>${resource.title} <span>★☆</span></h2>
        </a>
        <h5 class="category">${resource.category}</h5>
      </div>
    </div>
    <div class="line"></div>
    <div class="description">
      <p>${resource.description}</p>
    </div>
    <div class="tags">
      ${resource.tags
        .map(
          (tag, index) =>
            `<a href="javascript:void(0);" onclick="searchTag('${tag}')" class="tag tag${
              (index % 5) + 1
            }">#${tag}</a>`
        )
        .join("")}
    </div>
    
  `;

  return box;
}
function searchTag(tag) {
  document.getElementById("searchInput").value = tag;
  performSearch();
}
function setupPagination() {
  const pagination = document.querySelector(".pagination");
  pagination.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName === "A") {
      const page = e.target.textContent;
      if (page === "→") {
        currentPage++;
      } else if (page === "←") {
        currentPage--;
      } else {
        currentPage = parseInt(page);
      }
      fetchResources();
    }
  });
}

function updatePagination(totalPages) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  if (currentPage > 1) {
    pagination.innerHTML += `<a href="#">←</a>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      pagination.innerHTML += `<a href="#" class="active">${i}</a>`;
    } else {
      pagination.innerHTML += `<a href="#">${i}</a>`;
    }
  }

  if (currentPage < totalPages) {
    pagination.innerHTML += `<a href="#">→</a>`;
  }
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

async function performSearch() {
  searchTerm = document.getElementById("searchInput").value.trim();
  try {
    const response = await fetch(
      `/api/v1/query?search=${encodeURIComponent(
        searchTerm
      )}&page=${currentPage}&limit=${itemsPerPage}&category=${currentCategory}&tag=${currentTag}`
    );
    const data = await response.json();
    displayResources(data.data);
    updatePagination(data.totalPages);
  } catch (error) {
    console.error("Error searching resources: ", error);
  }
}
