let orderCount = 0;
const menuItems = ["오징어", "고구마", "만두", "김말이", "야채", "새우", "고추", "깻잎"];
const orderTypes = ["포장", "배달", "홀"];

function createNewOrder() {
  orderCount++;
  const orderId = `order-${Date.now()}`;
  const activeOrders = document.getElementById("activeOrders");

  const card = document.createElement("div");
  card.className = "order-card";
  card.id = orderId;

  const menuButtons = menuItems.map((item) => `<button class="menu-btn" onclick="addItem('${orderId}', '${item}')">${item}</button>`).join("");

  // 옵션 버튼 생성 (기본값: 포장)
  const typeButtons = orderTypes
    .map(
      (type) =>
        `<button class="type-btn ${type === "포장" ? "active" : ""}" 
                 onclick="setType('${orderId}', this)">${type}</button>`
    )
    .join("");

  card.innerHTML = `
        <div class="order-content">
            <div class="order-header">
                <span class="order-id">주문 #${orderCount}</span>
                <div class="type-selector">
                    ${typeButtons}
                </div>
            </div>
            <div class="menu-bar">
                ${menuButtons}
            </div>
            <div class="selected-list" id="list-${orderId}">
                <span style="color:#aaa; font-size:0.8rem;">튀김을 선택해 주세요.</span>
            </div>
        </div>
        <button class="done-btn" onclick="completeOrder('${orderId}')">완료</button>
    `;

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
  if (selectedItems[itemName] > 1) {
    selectedItems[itemName] -= 1;
  } else {
    delete selectedItems[itemName];
  }
  card.dataset.items = JSON.stringify(selectedItems);
  renderItems(orderId, selectedItems);
}

function renderItems(orderId, items) {
  const listDiv = document.getElementById(`list-${orderId}`);
  listDiv.innerHTML = "";
  const entries = Object.entries(items);
  if (entries.length === 0) {
    listDiv.innerHTML = '<span style="color:#aaa; font-size:0.8rem;">튀김을 선택해 주세요.</span>';
    return;
  }
  entries.forEach(([name, count]) => {
    const span = document.createElement("span");
    span.className = "item-tag";
    span.innerText = `${name} x${count}`;
    span.onclick = (e) => {
      e.stopPropagation();
      removeItem(orderId, name);
    };
    listDiv.appendChild(span);
  });
}

function completeOrder(orderId) {
  const card = document.getElementById(orderId);
  card.classList.add("history-card");
  document.getElementById("completedOrders").prepend(card);
}
