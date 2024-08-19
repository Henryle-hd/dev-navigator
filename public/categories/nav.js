document.addEventListener("DOMContentLoaded", () => {
  currentCategory = getCategoryFromUrl();
});

// get category from url
function getCategoryFromUrl() {
  const path = window.location.pathname;
  const parts = path.split("/");
  return parts[parts.length - 1];
}
let currentCategory = getCategoryFromUrl();
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
            <a href="../categories/youtube channel/" ${
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
