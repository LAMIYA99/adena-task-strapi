
import AxiosCall from "./Api/axios";

const api = new AxiosCall("http://localhost:1337/api/");

const PRODUCT_LIST_HTML = document.querySelector("#product-list");
const COLLECTION_LISTS   = document.querySelector("#collectionList");
const AVAILABILITY_LIST  = document.querySelector("#Availability");
const COLOR_LISTS        = document.querySelector("#colors");
const SIZE_LISTS         = document.querySelector("#sizes");

const FIRST_GRID_BTN  = document.querySelector("#firstGrid");
const SECOND_GRID_BTN = document.querySelector("#scndGrid");
const THIRD_GRID_BTN  = document.querySelector("#thirdGrid");
const FORTH_GRID_BTN  = document.querySelector("#fourtGrid");

const QUICK_VIEW_MODAL  = document.querySelector("#quickView");
const CLOSE_QUICK_VIEW  = document.querySelector(".ri-close-line");

const CART_MODAL   = document.getElementById("cartModal");
const CART_PANEL   = document.getElementById("cartPanel");
const CART_OVERLAY = document.getElementById("cartOverlay");
const CART_CLOSE   = document.getElementById("cartClose");
const CART_ITEMS   = document.querySelector("#cartItems");

const ALL_GRID_CLASSES = ["grid","grid-cols-2","grid-cols-3","grid-cols-4","grid-cols-5","gap-6","gap-8"];
const FLEX_CLASSES = ["flex","flex-col","gap-4","md:gap-6"];
const BTNS = [FIRST_GRID_BTN, SECOND_GRID_BTN, THIRD_GRID_BTN, FORTH_GRID_BTN];

const SUBMIT_REGISTER   = document.querySelector("#submitRegister");
const REGSITER_USERNAME = document.querySelector("#username");
const REGSITER_EMAIL    = document.querySelector("#email");
const REGSITER_PASSWORD = document.querySelector("#password");

const LOGIN_FORM     = document.querySelector("#loginForm");
const LOGIN_EMAIL    = document.querySelector("#loginEmail");
const LOGIN_PASSWORD = document.querySelector("#loginPassword");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------------------- HELPERS --------------------
function setActiveBtn(btn){
  BTNS.forEach((b)=>{ if(!b) return; b.style.backgroundColor=""; b.style.color=""; });
  if(!btn) return;
  btn.style.backgroundColor="#000";
  btn.style.color="#fff";
}

function applyListMode(isList){
  if(!PRODUCT_LIST_HTML) return;
  const cards = PRODUCT_LIST_HTML.querySelectorAll(".cards");
  cards.forEach((card)=>{
    const imgWrap  = card.querySelector(".img");
    const bodyWrap = card.querySelector(".mt-4");
    if(isList){
      card.classList.add("md:flex","md:items-start","md:gap-6");
      imgWrap?.classList.add("md:w-56","md:shrink-0","rounded-xl","overflow-hidden");
      bodyWrap?.classList.add("md:mt-0","flex-1");
    }else{
      card.classList.remove("md:flex","md:items-start","md:gap-6");
      imgWrap?.classList.remove("md:w-56","md:shrink-0","rounded-xl","overflow-hidden");
      bodyWrap?.classList.remove("md:mt-0","flex-1");
    }
  });

  const listOnlyEls = PRODUCT_LIST_HTML.querySelectorAll(".list-only");
  listOnlyEls.forEach((el)=>{ isList ? el.classList.remove("hidden") : el.classList.add("hidden"); });
}

function setGrid(btn, cols){
  if(PRODUCT_LIST_HTML){
    PRODUCT_LIST_HTML.classList.remove(...ALL_GRID_CLASSES, ...FLEX_CLASSES);
  }
  if(cols === 1){
    PRODUCT_LIST_HTML?.classList.add(...FLEX_CLASSES);
    setActiveBtn(btn);
    applyListMode(true);
  }else{
    PRODUCT_LIST_HTML?.classList.add("grid", `grid-cols-${cols}`, "gap-6");
    setActiveBtn(btn);
    applyListMode(false);
  }
}

function renderCart(){
  if(!CART_ITEMS) return;
  if(!cart.length){
    CART_ITEMS.innerHTML = `<div class="text-sm text-gray-500 py-6">Your cart is empty.</div>`;
    return;
  }

  const html = cart.map((item)=>{
    const unit = item.discountPrice ?? item.price ?? 0;
    const qty  = item.quantity ?? 1;
    const line = (unit * qty).toFixed(2);
    return `
      <div class="flex gap-3 py-3 border-b" data-id="${item.id}">
        <div class="w-[64px] h-[64px] rounded overflow-hidden bg-gray-100 shrink-0">
          <img src="http://localhost:1337${item?.image?.url}" alt="${item?.title}" class="w-full h-full object-cover"/>
        </div>
        <div class="flex-1">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h4 class="text-[13px] font-medium leading-5">${item?.title}</h4>
              <div class="text-[12px] text-gray-500">Qty: ${qty}</div>
            </div>
            <button class="p-1 rounded hover:bg-gray-100 js-remove" aria-label="Remove">
              <i class="ri-delete-bin-6-line text-[16px]"></i>
            </button>
          </div>
          <div class="mt-2 flex items-center gap-3">
            <div class="ml-auto text-[13px] font-medium">$${line}</div>
          </div>
              <div class="inline-flex items-center border rounded">
              <button class="cart-dec px-2 py-1 text-[14px]">–</button>
              <span class="px-3 select-none text-[13px]">${qty}</span>
              <button class="cart-inc px-2 py-1 text-[14px]">+</button>
            </div>
        </div>
      </div>
    `;
  }).join("");

  CART_ITEMS.innerHTML = html;
}

function openCartDrawer(){
  if(!CART_MODAL) return;
  CART_MODAL.classList.remove("hidden");
  requestAnimationFrame(()=>{
    CART_OVERLAY?.classList.add("opacity-100");
    CART_PANEL?.classList.remove("translate-x-full");
  });
}
function closeCartDrawer(){
  if(!CART_MODAL) return;
  CART_OVERLAY?.classList.remove("opacity-100");
  CART_PANEL?.classList.add("translate-x-full");
  setTimeout(()=>CART_MODAL.classList.add("hidden"), 300);
}

CART_ITEMS && CART_ITEMS.addEventListener("click", (e)=>{
  const row = e.target.closest("[data-id]");
  if(!row) return;
  const id = row.getAttribute("data-id");
  if(e.target.closest(".js-remove")){
    cart = cart.filter(i => String(i.id) !== String(id));
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

window.addToCardProducts = function addToCardProducts(data){
  if(typeof data === "string"){
    try{ data = JSON.parse(data); } catch(e){ console.error(e); return; }
  }
  const existing = cart.find(i => i.id === data.id);
  if(existing){
    existing.quantity = existing.quantity ?? 1; 
  }else{
    cart.push({ ...data, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  openCartDrawer();
};


// Qty +/– üçün listener
CART_ITEMS && CART_ITEMS.addEventListener("click", (e) => {
  const row = e.target.closest("[data-id]");
  if (!row) return;

  const id = row.getAttribute("data-id");
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;

  // + düyməsi
  if (e.target.closest(".cart-inc")) {
    item.quantity = Number(item.quantity || 1) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    return renderCart();
  }

  // – düyməsi
  if (e.target.closest(".cart-dec")) {
    if ((item.quantity || 1) <= 1) {
      // Əgər quantity = 1 idisə → məhsulu sil
      cart = cart.filter(i => String(i.id) !== String(id));
    } else {
      // Əks halda 1 azalt
      item.quantity = Number(item.quantity || 1) - 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return renderCart();
  }
});



const productsRender = (query = "")=>{
  api.getProducts(`products?populate=*${query}`).then((data)=>{
    const renderHtml = data?.data?.map((item)=>`
      <div class="cards group relative bg-white">
        <div class="img relative overflow-hidden">
          <img src="http://localhost:1337${item?.image?.url}" alt="${item?.title}">
          <div class="hover-img absolute inset-0 opacity-0 group-hover:opacity-100 duration-500">
            <img src="http://localhost:1337${item?.hoverimg?.url}" alt="${item?.title}">
          </div>

          ${item?.sale ? `
            <div class="sale absolute top-[20px] left-[20px] bg-[#d96e40] capitalize text-white min-w-[50px] leading-[20px] px-[10px] text-[14px]">
              <button>${item?.sale}</button>
            </div>` : ""}

          <div class="hover-icon absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
            <ul class="flex items-center gap-3">
              <li>
                <button onclick='addToCardProducts(${JSON.stringify(item)})'
                  class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <i class="ri-shopping-bag-2-line text-lg"></i>
                </button>
              </li>
              <li>
                <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                  <i class="ri-heart-3-line text-lg"></i>
                </button>
              </li>
              <li>
                <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                  <i class="ri-arrow-left-right-line text-lg"></i>
                </button>
              </li>
              <li>
                <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-400 js-open-qv">
                  <i class="ri-search-line text-lg"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex items-center text-[#fbbf24] text-sm">
            <i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i>
          </div>
          <h3 class="font-normal text-[14px]">${item?.title}</h3>
          <div class="flex items-center gap-2">
            ${item?.price ? `<span class="text-[#d96e40] text-[14px] line-through">$${item?.price}</span>` : ""}
            <span class="text-black text-[14px]">$${item?.discountPrice}</span>
          </div>
          <div class="flex items-center gap-2">
            ${item?.colors?.map((c)=>`
              <span class="w-5 h-5 rounded-full border inline-block" style="background-color:${c.code}" title="${c.Name}"></span>
            `).join("")}
          </div>
          <h3 class="list-only hidden text-[14px] leading-relaxed">
            Curabitur egestas malesuada volutpat. Nunc vel vestibulum odio, ac pellentesque lacus.
          </h3>
        </div>
      </div>
    `).join("");

    if(PRODUCT_LIST_HTML) PRODUCT_LIST_HTML.innerHTML = renderHtml;

    setGrid(SECOND_GRID_BTN, 3);

    PRODUCT_LIST_HTML?.querySelectorAll(".js-open-qv").forEach((btn)=>{
      btn.addEventListener("click", ()=>{
        QUICK_VIEW_MODAL?.classList.toggle("hidden");
      });
    });
    CLOSE_QUICK_VIEW && CLOSE_QUICK_VIEW.addEventListener("click", ()=>{
      QUICK_VIEW_MODAL?.classList.add("hidden");
    });
  });
};

const collections = ()=>{
  api.getProducts("collections").then((data)=>{
    const collectionRender = data?.data?.map((c)=>`
      <div class="flex items-center justify-between w-full cursor-pointer" data-id="${c.id}" data-type="collection">
        <span class="text-gray-600">${c?.Name}</span>
        <span class="text-gray-400 text-sm">(8)</span>
      </div>
    `).join("");
    if(COLLECTION_LISTS) COLLECTION_LISTS.innerHTML = collectionRender;

    COLLECTION_LISTS?.addEventListener("click",(e)=>{
      const target = e.target.closest("[data-id]");
      if(!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[collection][id][$eq]=${id}`);
    });
  });
};

const Availability = ()=>{
  api.getProducts("stocks").then((data)=>{
    const availabilityRender = data?.data?.map((s)=>`
      <div class="flex items-center justify-between w-full cursor-pointer" data-id="${s.id}" data-type="availability">
        <span class="text-gray-600">${s?.name}</span>
        <span class="text-gray-400 text-sm">(8)</span>
      </div>
    `).join("");
    if(AVAILABILITY_LIST) AVAILABILITY_LIST.innerHTML = availabilityRender;

    AVAILABILITY_LIST?.addEventListener("click",(e)=>{
      const target = e.target.closest("[data-id]");
      if(!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[stock][id][$eq]=${id}`);
    });
  });
};

const Colors = ()=>{
  api.getProducts("colors").then((data)=>{
    const colorsRender = data?.data?.map((c)=>`
      <li class="w-[30px] h-[30px] border border-gray-200 rounded-full cursor-pointer"
          style="background-color:${c?.code}" data-id="${c.id}" data-type="color"></li>
    `).join("");
    if(COLOR_LISTS) COLOR_LISTS.innerHTML = `<ul class="flex items-center gap-1.5">${colorsRender}</ul>`;

    COLOR_LISTS?.addEventListener("click",(e)=>{
      const target = e.target.closest("[data-id]");
      if(!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[colors][id][$eq]=${id}`);
    });
  });
};

const Sizes = ()=>{
  api.getProducts("sizes").then((data)=>{
    const sizeRender = data?.data?.map((s)=>`
      <button class="px-3 border border-gray-200 hover:bg-amber-900 hover:text-white duration-300 cursor-pointer"
              data-id="${s.id}" data-type="size">${s?.Name}</button>
    `).join("");
    if(SIZE_LISTS) SIZE_LISTS.innerHTML = sizeRender;

    SIZE_LISTS?.addEventListener("click",(e)=>{
      const target = e.target.closest("[data-id]");
      if(!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[sizes][id][$eq]=${id}`);
    });
  });
};

FIRST_GRID_BTN  && FIRST_GRID_BTN.addEventListener("click", ()=> setGrid(FIRST_GRID_BTN, 2));
SECOND_GRID_BTN && SECOND_GRID_BTN.addEventListener("click", ()=> setGrid(SECOND_GRID_BTN, 3));
THIRD_GRID_BTN  && THIRD_GRID_BTN.addEventListener("click", ()=> setGrid(THIRD_GRID_BTN, 4));
FORTH_GRID_BTN  && FORTH_GRID_BTN.addEventListener("click", ()=> setGrid(FORTH_GRID_BTN, 1));

// -------------------- CART DRAWER BINDINGS --------------------
CART_OVERLAY && CART_OVERLAY.addEventListener("click", closeCartDrawer);
CART_CLOSE   && CART_CLOSE.addEventListener("click", closeCartDrawer);
window.addEventListener("keydown", (e)=>{
  if(e.key === "Escape" && CART_MODAL && !CART_MODAL.classList.contains("hidden")){
    closeCartDrawer();
  }
});

// -------------------- AUTH --------------------
SUBMIT_REGISTER && SUBMIT_REGISTER.addEventListener("submit",(e)=>{
  e.preventDefault();
  const payload = {
    username: REGSITER_USERNAME.value,
    email: REGSITER_EMAIL.value,
    password: REGSITER_PASSWORD.value,
  };
  api.loginAuth("auth/local/register", payload).then((data)=>{
    if(data?.user){
      localStorage.setItem("email", data?.user?.email);
      setTimeout(()=>{ window.location.href = "../login.html"; }, 800);
      Swal?.fire?.({ title:"Registered", icon:"success", draggable:true });
    }
  });
});

LOGIN_FORM && LOGIN_FORM.addEventListener("submit",(e)=>{
  e.preventDefault();
  const payload = { identifier: LOGIN_EMAIL.value, password: LOGIN_PASSWORD.value };
  api.loginAuth("auth/local", payload).then((data)=>{
    if(data?.user){
      localStorage.setItem("token", data?.jwt);
      localStorage.setItem("email", data?.user?.email);
      setTimeout(()=>{ window.location.href = "/"; }, 800);
      Swal?.fire?.({ title:"Welcome", icon:"success", draggable:true });
    }
  });
});

function quickViewModalById(){
  return `
    <div class="bg-white w-[900px] max-w-[900px] rounded-lg shadow-lg relative flex">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-black">
        <i class="ri-close-line text-xl"></i>
      </button>
      <div class="w-1/2 bg-[#fafafa] flex items-center justify-center p-6">
        <img src="https://i.ibb.co/0rSx7fd/product1.png" alt="Butterfly Ring" class="w-[300px] object-contain"/>
      </div>
      <div class="w-1/2 p-8 overflow-y-auto">
        <h2 class="text-[22px] font-medium mb-2">Butterfly Ring</h2>
        <p class="text-gray-500 text-sm mb-2">By Lulu Store</p>
        <p class="text-[20px] font-semibold mb-4">$65.00</p>
        <p class="text-gray-500 text-sm leading-relaxed mb-6">Curabitur egestas malesuada volutpat.</p>
        <button class="bg-black text-white px-6 py-3 uppercase tracking-wide text-sm hover:bg-gray-800">Add to Cart</button>
      </div>
    </div>
  `;
}

function init(){
  renderCart();
  productsRender();
  collections();
  Availability();
  Colors();
  Sizes();
}
init();
