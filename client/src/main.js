import AxiosCall from "./Api/axios";

const api = new AxiosCall("http://localhost:1337/api/");

const PRODUCT_LIST_HTML = document.querySelector("#product-list");
const COLLECTION_LISTS = document.querySelector("#collectionList");
const AVAILABILITY_LIST = document.querySelector("#Availability");
const COLOR_LISTS = document.querySelector("#colors");
const SIZE_LISTS = document.querySelector("#sizes");
const FIRST_GRID_BTN = document.querySelector("#firstGrid");
const SECOND_GRID_BTN = document.querySelector("#scndGrid");
const THIRD_GRID_BTN = document.querySelector("#thirdGrid");
const FORTH_GRID_BTN = document.querySelector("#fourtGrid");

const ALL_GRID_CLASSES = ["grid", "grid-cols-2", "grid-cols-3", "grid-cols-4", "grid-cols-5", "gap-6", "gap-8"];
const FLEX_CLASSES = ["flex", "flex-col", "gap-4", "md:gap-6"];
const BTNS = [FIRST_GRID_BTN, SECOND_GRID_BTN, THIRD_GRID_BTN, FORTH_GRID_BTN];

function applyListMode(isList) {
  const cards = PRODUCT_LIST_HTML.querySelectorAll(".cards");
  cards.forEach(card => {
    const imgWrap = card.querySelector(".img");
    const bodyWrap = card.querySelector(".mt-4");

    if (isList) {
      // kartları yatay düz
      card.classList.add("md:flex", "md:items-start", "md:gap-6");
      imgWrap?.classList.add("md:w-56", "md:shrink-0", "rounded-xl", "overflow-hidden");
      bodyWrap?.classList.add("md:mt-0", "flex-1");
    } else {
      // grid moduna qayıt
      card.classList.remove("md:flex", "md:items-start", "md:gap-6");
      imgWrap?.classList.remove("md:w-56", "md:shrink-0", "rounded-xl", "overflow-hidden");
      bodyWrap?.classList.remove("md:mt-0", "flex-1");
    }
  });

  // Yalnız list rejimində görünəcək mətnləri idarə et
  const listOnlyEls = PRODUCT_LIST_HTML.querySelectorAll(".list-only");
  listOnlyEls.forEach(el => {
    if (isList) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}

function setActiveBtn(btn) {
  BTNS.forEach(b => {
    b.style.backgroundColor = "";
    b.style.color = "";
  });
  btn.style.backgroundColor = "#000";
  btn.style.color = "#fff";
}

function setGrid(btn, cols) {
  // əvvəl bütün layout classlarını sil
  PRODUCT_LIST_HTML.classList.remove(...ALL_GRID_CLASSES, ...FLEX_CLASSES);

  if (cols === 1) {
    // LIST VIEW (flex)
    PRODUCT_LIST_HTML.classList.add(...FLEX_CLASSES);
    setActiveBtn(btn);
    applyListMode(true);
  } else {
    // GRID VIEW
    PRODUCT_LIST_HTML.classList.add("grid", `grid-cols-${cols}`, "gap-6");
    setActiveBtn(btn);
    applyListMode(false);
  }
}

// eventlər
FIRST_GRID_BTN.addEventListener("click", () => setGrid(FIRST_GRID_BTN, 2));
SECOND_GRID_BTN.addEventListener("click", () => setGrid(SECOND_GRID_BTN, 3));
THIRD_GRID_BTN.addEventListener("click", () => setGrid(THIRD_GRID_BTN, 4));
FORTH_GRID_BTN.addEventListener("click", () => setGrid(FORTH_GRID_BTN, 1));

const productsRender = (query = "") => {
  api.getProducts(`products?populate=*${query}`).then((data) => {
    let renderHtml = data?.data
      ?.map(
        (item) => `
      <div class="cards group relative bg-white">
        <div class="img relative overflow-hidden">
          <img src="http://localhost:1337${item?.image?.url}" alt="">
          <div class="hover-img absolute inset-0 opacity-0 group-hover:opacity-100 duration-500">
            <img src="http://localhost:1337${item?.hoverimg?.url}" alt="">
          </div>
          ${item?.sale ? `
            <div class="sale absolute top-[20px] left-[20px] bg-[#d96e40] capitalize text-white min-w-[50px] leading-[20px] px-[10px] text-[14px]">
              <button>${item?.sale}</button>
            </div>` : ""
          }
          <div class="hover-icon absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
            <ul class="flex items-center gap-3">
              <li><button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100"><i class="ri-shopping-bag-2-line text-lg"></i></button></li>
              <li><button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200"><i class="ri-heart-3-line text-lg"></i></button></li>
              <li><button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300"><i class="ri-arrow-left-right-line text-lg"></i></button></li>
              <li><button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-400"><i class="ri-search-line text-lg"></i></button></li>
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
            ${item?.colors?.map(c => `
              <span class="w-5 h-5 rounded-full border inline-block" style="background-color:${c.code}" title="${c.Name}"></span>
            `).join("")}
          </div>

          <!-- Bu mətn yalnız LIST VIEW-də (1 ədəd olanda) görünsün -->
          <h3 class="list-only hidden text-[14px] leading-relaxed">
            Curabitur egestas malesuada volutpat. Nunc vel vestibulum odio, ac pellentesque lacus. Pellentesque dapibus nunc nec est imperdiet, a malesuada sem rutrum
          </h3>
        </div>
      </div>
    `).join("");

    PRODUCT_LIST_HTML.innerHTML = renderHtml;

    // ✨ ADDED: yalnız shopping-bag düyməsinə click-də cart drawer aç (event delegation, 1 dəfə bərkidilir)
    if (!window.__bagOpenBinded) {
      PRODUCT_LIST_HTML.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn && btn.querySelector('.ri-shopping-bag-2-line')) {
          openCartDrawer();
        }
      });
      window.__bagOpenBinded = true;
    }

    // DEFAULT: 3 kolon (grid)
    setGrid(SECOND_GRID_BTN, 3);
  });
};

productsRender();

const CART_MODAL   = document.getElementById('cartModal');
const CART_PANEL   = document.getElementById('cartPanel');
const CART_OVERLAY = document.getElementById('cartOverlay');
const CART_CLOSE   = document.getElementById('cartClose');

function openCartDrawer() {
  if (!CART_MODAL) return;
  CART_MODAL.classList.remove('hidden');
  requestAnimationFrame(() => {
    CART_OVERLAY && CART_OVERLAY.classList.add('opacity-100');
    CART_PANEL && CART_PANEL.classList.remove('translate-x-full');
  });
}
function closeCartDrawer() {
  if (!CART_MODAL) return;
  CART_OVERLAY && CART_OVERLAY.classList.remove('opacity-100');
  CART_PANEL && CART_PANEL.classList.add('translate-x-full');
  setTimeout(() => CART_MODAL.classList.add('hidden'), 300);
}

CART_OVERLAY?.addEventListener('click', closeCartDrawer);
CART_CLOSE?.addEventListener('click', closeCartDrawer);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && CART_MODAL && !CART_MODAL.classList.contains('hidden')) {
    closeCartDrawer();
  }
});


const collections = () => {
  api.getProducts("collections").then((data) => {
    let collectionRender = data?.data
      ?.map(
        (
          c
        ) => `<div class="flex items-center justify-between w-full cursor-pointer" data-id="${c.id}" data-type="collection">
          <span class="text-gray-600">${c?.Name}</span>
          <span class="text-gray-400 text-sm">(8)</span>
        </div>`
      )
      .join("");
    COLLECTION_LISTS.innerHTML = collectionRender;

    COLLECTION_LISTS.addEventListener("click", (e) => {
      const target = e.target.closest("[data-id]");
      if (!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[collection][id][$eq]=${id}`);
    });
  });
};

const Availability = () => {
  api.getProducts("stocks").then((data) => {
    let availabilityRender = data?.data
      ?.map(
        (
          s
        ) => `<div class="flex items-center justify-between w-full cursor-pointer" data-id="${s.id}" data-type="availability">
          <span class="text-gray-600">${s?.name}</span>
          <span class="text-gray-400 text-sm">(8)</span>
        </div>`
      )
      .join("");
    AVAILABILITY_LIST.innerHTML = availabilityRender;

    AVAILABILITY_LIST.addEventListener("click", (e) => {
      const target = e.target.closest("[data-id]");
      if (!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[stock][id][$eq]=${id}`);
    });
  });
};

const Colors = () => {
  api.getProducts("colors").then((data) => {
    console.log(data)
    let colorsRender = data?.data
      ?.map(
        (c) => `<li
          class="w-[30px] h-[30px] border border-gray-200 rounded-full cursor-pointer"
          style="background-color:${c?.code}"
          data-id="${c.id}" data-type="color"
        ></li>`
      )
      .join("");
    COLOR_LISTS.innerHTML = `<ul class="flex items-center gap-1.5">${colorsRender}</ul>`;

    COLOR_LISTS.addEventListener("click", (e) => {
      const target = e.target.closest("[data-id]");
      if (!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[colors][id][$eq]=${id}`);
    });
  });
};

const Sizes = () => {
  api.getProducts("sizes").then((data) => {
    let sizeRender = data?.data
      ?.map(
        (
          s
        ) => `<button class="px-3 border border-gray-200 hover:bg-amber-900 hover:text-white duration-300 cursor-pointer"
            data-id="${s.id}" data-type="size">
            ${s?.Name}
          </button>`
      )
      .join("");
    SIZE_LISTS.innerHTML = sizeRender;

    SIZE_LISTS.addEventListener("click", (e) => {
      const target = e.target.closest("[data-id]");
      if (!target) return;
      const id = target.dataset.id;
      productsRender(`&filters[sizes][id][$eq]=${id}`);
    });
  });
};

Sizes();
Colors();
Availability();
collections();
productsRender();




