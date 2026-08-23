const products = [
    { id: 1, name: "เสื้อยืดสีขาว", price: 150, category: "shirt", image: "เสื้อยืสีขาว.jpg" },
    { id: 2, name: "เสื้อยืดสีดำ", price: 150, category: "shirt", image: "ยืดดำ.jpg" },
    { id: 3, name: "เสื้อ Polo ", price: 500, category: "shirt", image: "polo.jpg" },
    { id: 4, name: "เสื้อฮู้ดดี้", price: 700, category: "shirt", image: "ฮุ้ดดี้.jpg" },
    { id: 5, name: "เสื้อเชิ้ตแขนยาว", price: 300, category: "shirt", image: "เชิ้ตแขนยาว 2.jpg" },
    { id: 6, name: "เสื้อกล้ามผู้หญิง", price: 200, category: "shirt", image: "กล้ามหญิง.jpg" },
    { id: 7, name: "เสื้อกล้ามผู้ชาย", price: 150, category: "shirt", image: "กล้ามชาย 1.jpg" },
    { id: 8, name: "กางเกยีนส์ขาสั่น ", price: 300, category: "pants", image: "ขาสั้น.jpg" },
    { id: 9, name: "กางเกงยีนส์ Baggy", price: 350, category: "pants", image: "Bagy.jpg" },
    { id: 10, name: "กางเกงสแล็คชาย", price: 350, category: "pants", image: "สแล็คชาย.jpg" },
    { id: 11, name: "หมวกแก๊ปขาว", price: 250, category: "hat", image: "แก็บขาว.jpg" },
    { id: 12, name: "หมวกแก๊ปเขียว", price: 250, category: "hat", image: "เเก็ปเขียว.jpg" },
    { id: 13, name: "หมวกแก๊ปน้ำเงิน", price: 250, category: "hat", image: "แก็บน้ำเงิน.jpg" },
    { id: 14, name: "หมวกแก๊ปครีม", price: 250, category: "hat", image: "เเก็บครีม.jpg" },
    
];

let cart = [];
const KBANK_ACCOUNT = "0762790998";
const SCB_ACCOUNT = "0001206020";

// แสดงรายการสินค้าแบบรองรับการกรอง
function displayProducts(itemsToDisplay = products) {
    const productList = document.getElementById("product-list");
    if (!productList) return;
    
    productList.innerHTML = "";

    if (itemsToDisplay.length === 0) {
        productList.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #777;'>ไม่พบสินค้าในหมวดหมู่นี้</p>";
        return;
    }

    itemsToDisplay.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price} บาท</p>
                <button class="add-btn" onclick="addToCart(${product.id})">เพิ่มลงตะกร้า</button>
            </div>
        `;
        productList.appendChild(card);
    });
}

// ฟังก์ชันกรองหมวดหมู่
function filterCategory(categoryName, element) {
    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
    element.classList.add("active");

    if (categoryName === "all") {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === categoryName);
        displayProducts(filtered);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// 🟢 อัปเดต UI ตะกร้าสินค้า (เพิ่มการแสดงรูปภาพเล็กๆ)
function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.length;

    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align:center;'>ไม่มีสินค้าในตะกร้า</p>";
        totalPriceElement.innerText = "0";
        return;
    }

    let itemsHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        itemsHTML += `
            <div class="cart-item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid #f1f5f9;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div>
                        <div style="font-weight: 600; font-size: 0.95rem; color: #1e293b;">${item.name}</div>
                        <div style="font-size: 0.85rem; color: #64748b;">${item.price} บาท</div>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">ลบ</button>
            </div>
        `;
        total += item.price;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    totalPriceElement.innerText = total;
}

function toggleCart() {
    const modal = document.getElementById("cart-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function checkout() {
    if (cart.length === 0) {
        alert("กรุณาเลือกสินค้าก่อนสั่งซื้อ!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // อัปเดต QR Code ทั้ง KBank และ SCB
    const kbankQrImg = document.getElementById("qr-kbank-img");
    const scbQrImg = document.getElementById("qr-scb-img");
    
    if (kbankQrImg) kbankQrImg.src = `https://promptpay.io/${KBANK_ACCOUNT}/${total}.png`;
    if (scbQrImg) scbQrImg.src = `https://promptpay.io/${SCB_ACCOUNT}/${total}.png`;
    
    document.getElementById("pay-amount").innerText = total;

    // รีเซ็ตการเลือกธนาคารให้กลับไป KBank เป็นค่าเริ่มต้น
    switchBankQR('kbank');

    resetSlipInput();
    toggleCart();
    document.getElementById("payment-modal").style.display = "flex";
}

function previewSlip(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("slip-preview").src = e.target.result;
            document.getElementById("slip-preview-container").style.display = "block";
            
            const labelText = document.getElementById("upload-label-text");
            if (labelText) {
                labelText.innerHTML = `✅ ${file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}`;
            }
        }
        reader.readAsDataURL(file);
    }
}

function resetSlipInput() {
    const slipInput = document.getElementById("slip-input");
    const slipPreview = document.getElementById("slip-preview");
    const slipContainer = document.getElementById("slip-preview-container");
    
    if (slipInput) slipInput.value = "";
    if (slipPreview) slipPreview.src = "";
    if (slipContainer) slipContainer.style.display = "none";
    
    const labelText = document.getElementById("upload-label-text");
    if (labelText) {
        labelText.innerHTML = " เลือกรูปสลิปโอนเงิน";
    }
}

function closePayment() {
    document.getElementById("payment-modal").style.display = "none";
}

function confirmPayment() {
    try {
        const slipInput = document.getElementById("slip-input");
        const slipFile = slipInput && slipInput.files ? slipInput.files[0] : null;

        if (!slipFile) {
            alert("กรุณาแนบสลิปการโอนเงินก่อนยืนยัน!");
            return;
        }

        if (!cart || cart.length === 0) {
            alert("ไม่พบรายการสินค้าในตะกร้า!");
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);

        const orderData = {
            id: 'ORD-' + Date.now().toString().slice(-6),
            date: new Date().toLocaleString('th-TH'),
            items: [...cart],
            totalPrice: total
        };

        let orders = JSON.parse(localStorage.getItem('my_orders')) || [];
        orders.unshift(orderData);
        localStorage.setItem('my_orders', JSON.stringify(orders));

        cart = [];
        updateCartUI();
        closePayment();

        setTimeout(() => {
            openOrderHistoryModal();
        }, 100);

    } catch (error) {
        console.error("Error in confirmPayment:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
}

function closeReceipt() {
    document.getElementById("receipt-modal").style.display = "none";
}

/* ==================== ระบบ Profile Dropdown & Logout ==================== */

function toggleProfileMenu() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.avatar-btn')) {
        const dropdown = document.getElementById("profile-dropdown");
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    alert("ออกจากระบบเรียบร้อยแล้ว");
    window.location.href = "login.html";
}

// เริ่มต้นแสดงผลสินค้า
displayProducts();

// --- ระบบจัดการที่อยู่สไตล์ Mobile App ---
function openAddressModal() {
    document.getElementById("addr-name").value = localStorage.getItem("addr_name") || "";
    document.getElementById("addr-phone").value = localStorage.getItem("addr_phone") || "";
    document.getElementById("addr-main").value = localStorage.getItem("addr_main") || "";
    document.getElementById("addr-detail").value = localStorage.getItem("addr_detail") || "";
    
    document.getElementById("address-modal").style.display = "flex";
}

function closeAddressModal() {
    document.getElementById("address-modal").style.display = "none";
}

function saveAddressData(e) {
    e.preventDefault();
    
    localStorage.setItem("addr_name", document.getElementById("addr-name").value);
    localStorage.setItem("addr_phone", document.getElementById("addr-phone").value);
    localStorage.setItem("addr_main", document.getElementById("addr-main").value);
    localStorage.setItem("addr_detail", document.getElementById("addr-detail").value);

    alert("บันทึกข้อมูลที่อยู่เรียบร้อยแล้ว!");
    closeAddressModal();
}

// --- ระบบจัดการข้อมูลส่วนตัว ---
function openProfileModal() {
    document.getElementById("profile-fullname").value = localStorage.getItem("user_fullname") || "";
    document.getElementById("profile-phone").value = localStorage.getItem("user_phone") || "";
    document.getElementById("profile-email").value = localStorage.getItem("user_email") || "";
    document.getElementById("profile-birthdate").value = localStorage.getItem("user_birthdate") || "";
    
    const savedGender = localStorage.getItem("user_gender") || "male";
    const genderRadio = document.querySelector(`input[name="gender"][value="${savedGender}"]`);
    if (genderRadio) genderRadio.checked = true;

    document.getElementById("profile-modal").style.display = "flex";
}

function closeProfileModal() {
    document.getElementById("profile-modal").style.display = "none";
}

function saveProfileData(e) {
    e.preventDefault();
    const fullname = document.getElementById("profile-fullname").value;
    const phone = document.getElementById("profile-phone").value;
    const email = document.getElementById("profile-email").value;
    const birthdate = document.getElementById("profile-birthdate").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "male";

    localStorage.setItem("user_fullname", fullname);
    localStorage.setItem("user_phone", phone);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_birthdate", birthdate);
    localStorage.setItem("user_gender", gender);

    const userDisplay = document.getElementById("user-display");
    if (userDisplay) userDisplay.innerText = `👤 ${fullname}`;

    alert("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!");
    closeProfileModal();
}

function switchBankQR(bank) {
    const kbankBox = document.getElementById('qr-box-kbank');
    const scbBox = document.getElementById('qr-box-scb');
    const kbankBtn = document.getElementById('btn-kbank');
    const scbBtn = document.getElementById('btn-scb');

    if (bank === 'kbank') {
        if (kbankBox) kbankBox.style.display = 'block';
        if (scbBox) scbBox.style.display = 'none';
        if (kbankBtn) kbankBtn.classList.add('active');
        if (scbBtn) scbBtn.classList.remove('active');
    } else if (bank === 'scb') {
        if (kbankBox) kbankBox.style.display = 'none';
        if (scbBox) scbBox.style.display = 'block';
        if (scbBtn) scbBtn.classList.add('active');
        if (kbankBtn) kbankBtn.classList.remove('active');
    }
}

/* ==================== ระบบประวัติการสั่งซื้อ ==================== */

function openOrderHistoryModal() {
    const modal = document.getElementById('order-history-modal');
    const container = document.getElementById('order-history-list');
    const orders = JSON.parse(localStorage.getItem('my_orders')) || [];

    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #888; padding: 2rem 0;">
                <p>ยังไม่มีประวัติการสั่งซื้อ</p>
            </div>`;
    } else {
        container.innerHTML = orders.map(order => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">
                    <strong>รหัส: ${order.id}</strong>
                    <span>${order.date}</span>
                </div>
                <hr style="border: none; border-top: 1px dashed #cbd5e1; margin: 0.5rem 0;">
                <div style="margin: 0.5rem 0;">
                    ${order.items.map(item => `
                        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px; color: #334155;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 6px;">
                                <span>${item.name}</span>
                            </div>
                            <span>${item.price.toLocaleString()} บาท</span>
                        </div>
                    `).join('')}
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0.5rem 0;">
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: bold; color: #1e293b;">
                    <span>ยอดรวมทั้งหมด:</span>
                    <span style="color: #ff477e;">${order.totalPrice.toLocaleString()} บาท</span>
                </div>
            </div>
        `).join('');
    }

    if (modal) modal.style.display = 'flex';
}

function closeOrderHistoryModal() {
    const modal = document.getElementById('order-history-modal');
    if (modal) modal.style.display = 'none';
}