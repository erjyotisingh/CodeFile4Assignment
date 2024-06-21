document.addEventListener("DOMContentLoaded", () => {
  const productListElement = document.getElementById("productList");
  const loadMoreButton = document.getElementById("loadMore");
  const resultsCount = document.getElementById("results-count");
  const sortSelect = document.getElementById("sort");
  const searchInput = document.getElementById("search");
  const categoryCheckboxes = document.querySelectorAll(
    "input[name='category']"
  );

  let currentPage = 1;
  const pageSize = 10;
  let allProducts = [];
  let filteredProducts = [];

  //fuction to fetch data from given api through fetch method using async await

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      allProducts = await response.json();
      filteredProducts = [...allProducts]; // To show all products Initially
      displayProducts();
    } catch (error) {
      console.error("Not able to fetch products:", error.message);
      alert("Not able to fetch products: " + error.message);
    }
  };

  const displayProducts = () => {
    try {
      const sortedProducts = sortProducts(filteredProducts);
      const productsToShow = sortedProducts.slice(0, currentPage * pageSize);

      resultsCount.textContent = `${sortedProducts.length} Results`;
      productListElement.innerHTML = "";
      productsToShow.forEach((product) => {
        const productItem = createProductElement(product);
        productListElement.appendChild(productItem);
      });

      if (productsToShow.length < sortedProducts.length) {
        loadMoreButton.style.display = "block";
      } else {
        loadMoreButton.style.display = "none";
      }
    } catch (error) {
      console.error("Error displaying products:", error.message);
      alert("Error displaying products: " + error.message);
    }
  };

  const filterProducts = () => {
    try {
      let tempProducts = [...allProducts];
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value.toLowerCase());

      if (selectedCategories.length > 0) {
        tempProducts = tempProducts.filter((product) =>
          selectedCategories.includes(product.category.toLowerCase())
        );
      }

      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm !== "") {
        tempProducts = tempProducts.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
      }

      return tempProducts;
    } catch (error) {
      console.error("Error filtering products:", error.message);
      alert("Error filtering products: " + error.message);
      return [];
    }
  };

  const sortProducts = (products) => {
    try {
      const sortValue = sortSelect.value;
      switch (sortValue) {
        case "priceLowHigh":
          return products.sort((a, b) => a.price - b.price);
        case "priceHighLow":
          return products.sort((a, b) => b.price - a.price);
        default:
          return products;
      }
    } catch (error) {
      console.error("Error sorting products:", error.message);
      alert("Error sorting products: " + error.message);
      return products;
    }
  };

  const createProductElement = (product) => {
    try {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      // Product image
      const productImage = document.createElement("img");
      productImage.src = product.image;
      productImage.alt = product.title;
      productItem.appendChild(productImage);

      // Product title
      const productTitle = document.createElement("h3");
      productTitle.textContent = product.title;
      productTitle.classList.add("product-title");
      productItem.appendChild(productTitle);

      // Product price
      const productPrice = document.createElement("p");
      productPrice.textContent = `$${product.price}`;
      productPrice.classList.add("product-price");
      productItem.appendChild(productPrice);

      return productItem;
    } catch (error) {
      console.error("Error creating product element:", error.message);
      alert("Error creating product element: " + error.message);
    }
  };

  const loadMoreProducts = () => {
    currentPage++;
    displayProducts();
  };

  loadMoreButton.addEventListener("click", loadMoreProducts);

  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    displayProducts();
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    filteredProducts = filterProducts();
    displayProducts();
  });

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      currentPage = 1;
      filteredProducts = filterProducts();
      displayProducts();
    });
  });

  fetchProducts();
});
