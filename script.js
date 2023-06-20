// Function to fetch data from the URL and display values in boxes
function fetchDataAndDisplay() {
  fetch("https://dummyjson.com/products")
    .then(response => response.json())
    .then(data => {
      // Get the container element to hold the boxes
      const container = document.getElementById("container");
      const searchInput = document.getElementById('searchInput');
      const pageDropdown = document.getElementById('pageDropdown');
      const pageOptions = document.getElementById('options');
      const noRecordsFound = document.getElementById('noRecordsFound');
      const dropdownPage = document.getElementById('dropdown');

      // Check if data is an object
      if (typeof data === "object" && data !== null) {
        const boxes = [];
        const filteredBoxes = [];
        let currentPage = 1;
        let itemsPerPage = parseInt(pageDropdown.value);

        // Iterate over the properties of the object
        for (let x in data.products) {
          const box = createProductBox(data.products[x]);
          boxes.push(box);
          filteredBoxes.push(box);
        }
        searchInput.addEventListener('input', function () {
          const searchValue = this.value.toLowerCase();
          // Filter the boxes based on the search input
          filteredBoxes.length = 0;
          let found = false; // Variable to track if any matching records are found

          for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            const title = box.querySelector("h2").textContent.toLowerCase();

            if (title.includes(searchValue)) {
              box.style.display = "block";
              filteredBoxes.push(box);
              found = true; // At least one matching record is found
            } else {
              box.style.display = "none";
            }
          }

  // Show/hide the "No records found" message
  if (found) {
  noRecordsFound.style.display = "none";
  paginationButtons.style.display = "block";
  pageOptions.style.display = "block";
  } else {
  noRecordsFound.style.display = "block";
  paginationButtons.style.display = "none";
  pageOptions.style.display = "none";
  }

  currentPage = 1;
  updatePagination();
  });

  function createProductBox(product) {
  //Create a div element for each product
  const box = document.createElement("div");
  box.classList.add("box");

  // Creating download icon
  const downloadIcon = document.createElement("i");
  downloadIcon.classList.add("fa-solid", "fa-cloud-arrow-down", "download-icon");

  // Add event listener to the download icon
  downloadIcon.addEventListener("click", function() {
  downloadProductImage(product.thumbnail);
  });

  // Create elements for thumbnail, title, description, and price
  const thumbnail = document.createElement("img");
  thumbnail.src = product.thumbnail;
  thumbnail.classList.add("thumbnail");

  const title = document.createElement("h2");
  title.textContent = product.title;

  
 
  const description = document.createElement("p");
  description.textContent = product.description;
  description.classList.add("tooltip");
  
  const tooltip = document.createElement("span");
  tooltip.classList.add("tooltiptext");
  tooltip.textContent = product.description;
  
  // Toggle tooltip visibility on click
  description.addEventListener("click", function() {
  tooltip.classList.toggle("active");
  });
  
  // Add tooltip to the description element
  description.appendChild(tooltip);
  
  const price = document.createElement("span");
  price.textContent = "Price: $" + product.price;

  // Creating Buttons
  const button = document.createElement("button");
  button.textContent = "ADD TO CART";

  // Add event listener to the "Add to Cart" button
  button.addEventListener("click", function() {
  const productTitle = product.title;

  // Check if the product with the same title already exists in the cart
  const cart = sessionStorage.getItem("cart");
  if (cart) {
  const cartItems = JSON.parse(cart);
  const foundItem = cartItems.find(item => item.title === productTitle);

  if (foundItem) {
  // Display a confirm dialog if the product already exists in the cart
  const confirmResult = confirm("This item is already in the cart. Do you still want to add it again?");

  if (confirmResult) {
  // If "OK" is clicked, increase the quantity of the existing item
  foundItem.quantity += 1;

  // Store the updated cart in sessionStorage
  sessionStorage.setItem("cart", JSON.stringify(cartItems));

  // Redirect to the cart page
  window.location.href = "cart.html";
  }
  return;
  }
  }
  // If the product is not found in the cart or "Cancel" is clicked in the confirm dialog,
  // proceed to add the new item to the cart as before
  // Retrieve the product details
  const productThumbnail = product.thumbnail;
  const productPrice = product.price;
  const productDescription = product.description;
  const productQuantity = 1; // Set the initial quantity to 1

  // Store the product details in sessionStorage
  const cartItem = {
              thumbnail: productThumbnail,
              title: productTitle,
              description: productDescription,
              price: productPrice,
              quantity: productQuantity
            };

  // Check if the cart already exists in sessionStorage
  let updatedCart = [];
            if (cart) {
  // If the cart exists, parse it from JSON
  updatedCart = JSON.parse(cart);
            }

  // Add the new item to the cart
  updatedCart.push(cartItem);
  // Store the updated cart in sessionStorage
  sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  // Redirect to the cart page
  window.location.href = "cart.html";
  });

          box.appendChild(thumbnail);
          box.appendChild(title);
          box.appendChild(description);
          box.appendChild(price);
          box.appendChild(document.createElement("br"));
          box.appendChild(document.createElement("br"));
          box.appendChild(button);
          box.appendChild(downloadIcon);

          container.appendChild(box);
          return box;
        }

        function displayPaginationButtons() {
          const paginationButtons = document.getElementById('paginationButtons');
          paginationButtons.innerHTML = '';

          const totalPages = Math.ceil(filteredBoxes.length / itemsPerPage);

          // Create the first button
          const firstButton = document.createElement('button');
          firstButton.innerText = '<<';
          firstButton.addEventListener('click', () => {
            if (currentPage !== 1) {
              currentPage = 1;
              updatePagination();
            }
          });
          paginationButtons.appendChild(firstButton);

          // Create the previous button
          const prevButton = document.createElement('button');
          prevButton.innerText = '|<';
          prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
              currentPage--;
              updatePagination();
            }
          });
          paginationButtons.appendChild(prevButton);

          // Create the page number buttons
          for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.addEventListener('click', () => {
              currentPage = i;
              updatePagination();
            });

            if (i === currentPage) {
              button.classList.add('active');
            }

            paginationButtons.appendChild(button);
          }

          // Create the next button
          const nextButton = document.createElement('button');
          nextButton.innerText = '>|';
          nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
              currentPage++;
              updatePagination();
            }
          });
          paginationButtons.appendChild(nextButton);

          // Create the last button
          const lastButton = document.createElement('button');
          lastButton.innerText = '>>';
          lastButton.addEventListener('click', () => {
            if (currentPage !== totalPages) {
              currentPage = totalPages;
              updatePagination();
            }
          });
          paginationButtons.appendChild(lastButton);

          // Update active state for buttons
          const pageButtons = paginationButtons.querySelectorAll('button');
          pageButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
              pageButtons.forEach(btn => btn.classList.remove('active'));
              button.classList.add('active');
            });
          });
        }

        function updatePagination() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Hide all boxes
        filteredBoxes.forEach(box => {
        box.style.display = "none";
        });

        // Display current page boxes
        const currentPageBoxes = filteredBoxes.slice(start, end);
        currentPageBoxes.forEach(box => {
        box.style.display = "block";
        });

        displayPaginationButtons();
        }

        // Event listener for page dropdown change
        pageDropdown.addEventListener('change', function () {
          itemsPerPage = parseInt(this.value);
          currentPage = 1;
          updatePagination();
        });

        updatePagination();
      }
    })
    .catch(error => {
      console.log("Error fetching data:", error);
    });
}

// Function to download the product image
function downloadProductImage(imageUrl) {
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "box_image";
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.log("Error downloading image:", error);
    });
}
// Call the function to fetch data and display it
fetchDataAndDisplay();
