document.addEventListener("DOMContentLoaded", () => {
  currentCategory = getCategoryFromUrl();
  fetchResources();
  setupPagination();
  setupSearch();
});

// get category from url
function getCategoryFromUrl() {
  const path = window.location.pathname;
  const parts = path.split("/");
  return parts[parts.length - 2] || "website";
}

let currentPage = 1;
const itemsPerPage = 10;
let currentCategory = getCategoryFromUrl();
let currentTag = "";
let searchTerm = "";

document.getElementById("nav-placeholder").innerHTML = `
 <div class="title">
        <h2>
          <a href="/">Dev<span>Nav</span></a>
        </h2>
      </div>
      <div class="category">
        <ul>
          <li><a href="/" ${
            currentCategory === "all" ? 'class="currentPage"' : ""
          }>All</a></li>
          <li><a href="../website/" ${
            currentCategory === "website" ? 'class="currentPage"' : ""
          }>Websites</a></li>
          <li>
            <a href="../youtube channel/" ${
              currentCategory === "youtube%20channel"
                ? 'class="currentPage"'
                : ""
            }>Youtube-Channel</a>
          </li>
          <li><a href="../book/" ${
            currentCategory === "book" ? 'class="currentPage"' : ""
          }>Books</a></li>
          <li><a href="../blog/" ${
            currentCategory === "blog" ? 'class="currentPage"' : ""
          }>Blogs</a></li>
        </ul>
        <div class="addResource">
    <a href="/addResource" class="addBTN" title="add resources"
      >+resources 📚
    </a>
  </div>
      </div>
      <div class="socialMedia">
        <ul>
          <li class="x">
            <a href="https://x.com/Henrylee_hd" title="x">
              <img src="../../twitter.png" alt="Twitter" />
            </a>
          </li>
          <li class="github">
            <a href="https://github.com/Henryle-hd" title="gitHub">
              <img src="../../developer.png" alt="GitHub" />
            </a>
          </li>
          <li class="buyMeCoffee">
      <a href="https://buymeacoffee.com/henrylee" title="buyMeCoffee">
        <img src="../../coffee.png" alt="buyMeCoffee" />
      </a>
    </li>
        </ul>
      </div>
`;
document.getElementById("f-placeholder").innerHTML = `
<div class="socialMedia">
        <ul>
          <li class="x">
            <a href="https://x.com/Henrylee_hd" title="x">
              <img src="../../twitter.png" alt="Twitter" />
            </a>
          </li>
          <li class="github">
            <a href="https://github.com/Henryle-hd" title="github">
              <img src="../../developer.png" alt="GitHub" />
            </a>
          </li>
          <li class="buyMeCoffee">
            <a href="https://buymeacoffee.com/henrylee" title="buyMeCoffee">
              <img src="../../coffee.png" alt="buyMeCoffee" />
            </a>
          </li>
        </ul>
      </div>
       <div class="addResource">
        <a href="/addResource" class="addBTN" title="add resources"
          >+resources 📚
        </a>
      </div>
`;
async function fetchResources() {
  try {
    const response = await fetch(
      `/api/v1/query?page=${currentPage}&limit=${itemsPerPage}&category=${currentCategory}&tag=${currentTag}`
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

  const defaultImage = "../../default.png";
  const defaultForYoutube = "../../youtube-icon.png";

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
            `<a href="javascript:void(0)" onClick="searchTag('${tag}') " class="tag tag${
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
