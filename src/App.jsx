import { useEffect, useState } from "react";

function App() {
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/public/database-response.json");
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setProductData(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load products. Please try again later.");
      }
    }

    fetchProducts();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }
  //Events interracting

  const [isNavOpen, setState] = useState(false);
  const [sizeFilter, setSize] = useState("Any");
  const [brandFilter, setBrand] = useState("Any");
  const [genderFilter, setGender] = useState("Any");
  const [stockFilter, setStockFilter] = useState(false);
  const [isOpen, setModalState] = useState(false);
  const [chosenProducts, setProduct] = useState([]);
  const [value, setValue] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const searchFunc = () => {
    setNameFilter(value.toLowerCase());
  };

  return (
    <div className="page-wrapper">
      <main>
        <Header isNavOpen={isNavOpen} setState={setState} />
        <Nav
          isNavOpen={isNavOpen}
          setState={setState}
          setSize={setSize}
          setBrand={setBrand}
          setGender={setGender}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          isOpen={isOpen}
          setModalState={setModalState}
          chosenProducts={chosenProducts}
          setProduct={setProduct}
        />
        <Modal
          isOpen={isOpen}
          setModalState={setModalState}
          chosenProducts={chosenProducts}
          setProduct={setProduct}
        />
        <SearchProduct setValue={setValue} searchFunc={searchFunc} />
        <ProductCards
          sizeFilter={sizeFilter}
          brandFilter={brandFilter}
          genderFilter={genderFilter}
          stockFilter={stockFilter}
          productData={productData}
          chosenProducts={chosenProducts}
          setProduct={setProduct}
          searchFunc={searchFunc}
          nameFilter={nameFilter}
        />
        <BottomNav />
        <Footer />
      </main>
    </div>
  );
}

function Header({ isNavOpen, setState }) {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <img src="/public/icons/logo.svg" alt="logo" />
          <h1>Runway Store</h1>
          <h2>®</h2>
        </div>
      </div>

      <button
        className="open-close-nav"
        onClick={() => (isNavOpen ? setState(false) : setState(true))}
      >
        Filters
        <img
          src={
            isNavOpen
              ? "public/icons/close-modal.svg"
              : "/public/icons/open-modal.svg"
          }
          alt="open modal button"
        />
      </button>
    </header>
  );
}

function Nav({
  isNavOpen,
  setState,
  setSize,
  setBrand,
  setGender,
  stockFilter,
  setStockFilter,
  isOpen,
  setModalState,
  chosenProducts,
  setProduct,
}) {
  return (
    <nav className={isNavOpen ? "" : "hiden"}>
      <div className="container">
        <div className="nav-content">
          <div className="select-content">
            <h3>Size:</h3>
            <select onChange={(event) => setSize(event.target.value)}>
              <option value="Any">Any</option>
              <option value="38">36</option>
              <option value="38">37</option>
              <option value="38">38</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
            </select>
          </div>

          <div className="select-content">
            <h3>Brand:</h3>
            <select onChange={(event) => setBrand(event.target.value)}>
              <option value="Any">Any</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="New Balance">New Balance</option>
              <option value="Puma">Puma</option>
              <option value="Asics">Asics</option>
              <option value="Reebok">Reebok</option>
              <option value="Salomon">Salomon</option>
              <option value="Vans">Vans</option>
            </select>
          </div>

          <div className="select-content">
            <h3>Gender:</h3>
            <select onChange={(event) => setGender(event.target.value)}>
              <option value="Any">Any</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="checkbox-content">
            <label>In Stock:</label>
            <input
              type="checkbox"
              onClick={() => setStockFilter(stockFilter ? false : true)}
            />
          </div>

          <button onClick={() => setModalState(isOpen ? false : true)}>
            <img src="/public/icons/shopping-cart.svg" alt="" />
            <h5>{chosenProducts.length}</h5>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Modal({ isOpen, setModalState, chosenProducts, setProduct }) {
  const deletingElem = (item) => {
    setProduct([
      ...chosenProducts.slice(0, chosenProducts.indexOf(item)),
      ...chosenProducts.slice(chosenProducts.indexOf(item) + 1),
    ]);
  };

  const addQuantity = (product) => {
    setProduct(
      chosenProducts.map((item) =>
        item === product ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const reduceQuantity = (product) => {
    setProduct(
      chosenProducts.map((item) =>
        item === product ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  return (
    <div className={isOpen ? "modal" : "modal hiden"}>
      <div className="modal-title">
        <h2>Shopping Cart</h2>
        <button
          type="button"
          onClick={() => setModalState(isOpen ? false : true)}
          className="close-modal"
        >
          x
        </button>
      </div>
      {chosenProducts.map((product) => (
        <div className="selected-product">
          <img src={product.image_url} alt={product.image_url} />
          <div className="general-abt">
            <h3>{product.name}</h3>
            <h4>{product.gender}</h4>
          </div>

          <div className="price">
            <h3>{product.price} $</h3>
          </div>

          <div className="quantity-counter">
            <button
              onClick={() =>
                product.quantity === 1
                  ? deletingElem(product)
                  : reduceQuantity(product)
              }
            >
              -
            </button>
            <h3>{product.quantity}</h3>
            <button
              onClick={() => {
                addQuantity(product);
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <h3>{chosenProducts.length < 1 ? "No products to order😐..." : ""}</h3>
      <button>Order Now!</button>
    </div>
  );
}

function SearchProduct({ setValue, searchFunc }) {
  return (
    <section className="search">
      <div className="container">
        <div className="search-products">
          <input
            type="text"
            placeholder="Example: New Balance 574"
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="button" onClick={searchFunc}>
            <img src="/public/icons/search.svg" alt="search icon" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductCards({
  sizeFilter,
  brandFilter,
  genderFilter,
  stockFilter,
  productData,
  chosenProducts,
  setProduct,
  nameFilter,
}) {
  return (
    <section className="product-cards">
      <div className="container">
        <div className="product-container">
          {productData.map((product) => {
            const stockMatch =
              !stockFilter || (product.in_stock && stockFilter);
            const sizeMatch =
              sizeFilter === "Any" ||
              product.sizes.includes(Number(sizeFilter));
            const brandMatch =
              brandFilter === "Any" || product.brand.includes(brandFilter);
            const genderMatch =
              genderFilter === "Any" || product.gender.includes(genderFilter);
            const name = product.name.toLowerCase().includes(nameFilter);

            if (
              !stockMatch ||
              !sizeMatch ||
              !brandMatch ||
              !genderMatch ||
              !name
            ) {
              return null;
            }

            return (
              <div
                className={`product ${!product.in_stock ? "out-stock" : ""}`}
                key={product.id}
              >
                <img src={product.image_url} alt={product.name} />
                <h2>{product.name}</h2>
                <h3>{product.brand}</h3>
                <h3>{product.gender} model</h3>
                <h2>{product.price} $</h2>
                <div className="current-sizes">
                  {product.sizes.map((size) => (
                    <h4 key={size}>{size}</h4>
                  ))}
                </div>
                <button
                  className={!product.in_stock ? "not-allowed" : ""}
                  onClick={() => {
                    if (
                      chosenProducts.filter(
                        (item) => item.name === product.name
                      ).length < 1 &&
                      product.in_stock
                    )
                      setProduct([
                        ...chosenProducts,
                        {
                          name: product.name,
                          image_url: product.image_url,
                          brand: product.brand,
                          gender: product.gender,
                          price: product.price,
                          quantity: 1,
                        },
                      ]);
                  }}
                >
                  {!product.in_stock ? "Out of stock" : "Add to cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BottomNav() {
  return (
    <section className="bottom-nav">
      <div className="container">
        <div className="bottom-nav-content">
          <div className="column">
            <h2>Shop</h2>
            <ul>
              <li>
                <a href="#">Men's Sneakers</a>
              </li>
              <li>
                <a href="#">Women's Sneakers</a>
              </li>
              <li>
                <a href="#">Kids' Sneakers</a>
              </li>
              <li>
                <a href="#">New Arrivals</a>
              </li>
              <li>
                <a href="#">Best Sellers</a>
              </li>
            </ul>
          </div>
          <div className="column">
            <h2>Customer Service</h2>
            <ul>
              <li>
                <a href="#">Shipping & Delivery</a>
              </li>
              <li>
                <a href="#">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#">Size Guide</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="column">
            <h2>About</h2>
            <ul>
              <li>
                <a href="#">Our Story</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Store Locator</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <h2>© 2025 Runway Store. All rights reserved.</h2>
        </div>
      </div>
    </footer>
  );
}

export default App;
