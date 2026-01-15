let orderCount = 0;
const specialMenus = ["새우", "고추", "깻잎"];
const menuItems = ["기본세트", "오징어", "고구마", "만두", "김말이", "야채", "새우", "고추", "깻잎"];
const orderTypes = ["포장", "배달", "홀"];

function createNewOrder() {
  orderCount++;
  const orderId = `order-${Date.now()}`;
  const activeOrders = document.getElementById("activeOrders");

  const card = document.createElement("div");
  card.className = "order-card";
  card.id = orderId;

  // 1. 버튼 문자열 생성 (인라인 클릭 삭제)

  const menuButtonsHtml = menuItems
    .map((item) => {
      // 해당 아이템이 강조 메뉴에 포함되는지 확인
      const highlightClass = specialMenus.includes(item) ? "highlight" : "";
      return `<button class="menu-btn ${highlightClass}" data-item="${item}">${item}</button>`;
    })
    .join("");

  const typeButtons = orderTypes.map((type) => `<button class="type-btn ${type === "포장" ? "active" : ""}" data-type="${type}">${type}</button>`).join("");

  card.innerHTML = `
        <div class="order-content">
            <div class="order-header">
                <span class="order-id">주문 #${orderCount}</span>
                <div class="type-selector">
                    ${typeButtons}
                </div>
            </div>
            <div class="menu-bar">
                ${menuButtonsHtml}
            </div>
            <div class="selected-list" id="list-${orderId}">
                <span style="color:#aaa; font-size:0.8rem;">튀김을 선택해 주세요.</span>
            </div>
        </div>
        <button class="done-btn">완료</button>
    `;

  // 2. 이벤트 리스너 직접 할당 (반응성 최적화)
  const handleAction = (e, callback) => {
    // 모바일/웹 통합 대응: pointerup 사용
    // 클릭 후 잔상 방지 및 연속 클릭 최적화
    e.preventDefault();
    callback();
  };

  // 메뉴 버튼 이벤트 바인딩
  card.querySelectorAll(".menu-btn").forEach((btn) => {
    const itemName = btn.dataset.item;
    btn.addEventListener("pointerup", (e) => handleAction(e, () => addItem(orderId, itemName)));
    // PC 환경 브라우저 호환성을 위해 클릭 중복 방지 처리된 리스너
    btn.addEventListener("click", (e) => e.preventDefault());
  });

  // 타입 버튼 이벤트 바인딩
  card.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("pointerup", (e) => handleAction(e, () => setType(orderId, btn)));
    btn.addEventListener("click", (e) => e.preventDefault());
  });

  // 완료 버튼 이벤트 바인딩
  card.querySelector(".done-btn").addEventListener("pointerup", (e) => {
    handleAction(e, () => completeOrder(orderId));
  });

  activeOrders.prepend(card);
  card.dataset.items = JSON.stringify({});
}

/**
 * 포장/배달/홀 타입 설정 함수
 */
function setType(orderId, btn) {
  const card = document.getElementById(orderId);
  if (card.parentElement.id === "completedOrders") return; // 완료된 주문은 변경 불가

  // 해당 카드의 모든 타입 버튼에서 active 클래스 제거 후 클릭한 버튼에 추가
  const buttons = btn.parentElement.querySelectorAll(".type-btn");
  buttons.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function addItem(orderId, itemName) {
  const card = document.getElementById(orderId);
  if (!card) return;
  const selectedItems = JSON.parse(card.dataset.items);
  selectedItems[itemName] = (selectedItems[itemName] || 0) + 1;
  card.dataset.items = JSON.stringify(selectedItems);
  renderItems(orderId, selectedItems);
}

function removeItem(orderId, itemName) {
  const card = document.getElementById(orderId);
  if (card.parentElement.id === "completedOrders") return;
  const selectedItems = JSON.parse(card.dataset.items);
  delete selectedItems[itemName];
  card.dataset.items = JSON.stringify(selectedItems);
  renderItems(orderId, selectedItems);
}

function renderItems(orderId, items) {
  const listDiv = document.getElementById(`list-${orderId}`);
  if (!listDiv) return;

  listDiv.innerHTML = "";
  const entries = Object.entries(items);

  if (entries.length === 0) {
    listDiv.innerHTML = '<span style="color:#aaa; font-size:0.8rem;">튀김을 선택해 주세요.</span>';
    return;
  }

  entries.forEach(([name, count]) => {
    const span = document.createElement("span");
    span.className = "item-tag";

    // 이름은 흰색(기본), 숫자는 count-text 클래스를 통해 붉은색으로 표시
    span.innerHTML = `${name} <span class="count-text">x${count}</span>`;

    // 클릭 시 제거 기능 (pointerup 이벤트 권장)
    span.addEventListener("pointerup", (e) => {
      e.preventDefault();
      removeItem(orderId, name);
    });

    listDiv.appendChild(span);
  });
}

function completeOrder(orderId) {
  const card = document.getElementById(orderId);
  card.classList.add("history-card");
  document.getElementById("completedOrders").prepend(card);
}
