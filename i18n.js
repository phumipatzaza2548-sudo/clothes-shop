/* ==================== เปลี่ยนภาษา ไทย ↔ English ==================== */
// วิธีทำงาน: ข้อความต้นฉบับในเว็บเป็นภาษาไทย เมื่อเลือก English สคริปต์นี้จะแปลข้อความ
// และ attribute (placeholder, aria-label, title, alt) ทุกจุดที่แสดงบนหน้า รวมถึงข้อความที่ JS
// สร้างขึ้นภายหลัง (toast, error, ตะกร้า) ผ่าน MutationObserver โดยไม่ต้องแก้โค้ดเดิม
// เพิ่มข้อความใหม่: ใส่คู่ "ข้อความไทย": "English" ใน EN ด้านล่าง
// ข้อความที่มีส่วนเปลี่ยนได้ ใช้ {} ฝั่งไทย และ {0}, {1} ฝั่งอังกฤษตามลำดับ
(function (global) {
    const STORAGE_KEY = "shop_lang";
    const TRANSLATED_ATTRIBUTES = ["placeholder", "aria-label", "title", "alt"];
    // อักษรไทย ไม่นับสัญลักษณ์ ฿ (U+0E3F) ที่ใช้ได้ทั้งสองภาษา
    const THAI = /[ก-ฺเ-๛]/;

    const EN = {
        /* ---------- ทั่วไป / Header ---------- */
        "My Clothing Shop หน้าแรก": "My Clothing Shop home",
        "My Clothing Shop — เสื้อผ้าแฟชั่นพร้อมส่ง": "My Clothing Shop — Fashion ready to ship",
        "เข้าสู่ระบบ — My Clothing Shop": "Sign in — My Clothing Shop",
        "สมัครสมาชิก — My Clothing Shop": "Sign up — My Clothing Shop",
        "หมวดหมู่สินค้า": "Product categories",
        "สินค้าทั้งหมด": "All products",
        "ทั้งหมด": "All",
        "เสื้อ": "Tops",
        "กางเกง": "Pants",
        "รองเท้า": "Shoes",
        "หมวก": "Hats",
        "สลับเป็นธีมสว่าง": "Switch to light theme",
        "สลับเป็นธีมมืด": "Switch to dark theme",
        "เปลี่ยนเป็นธีมสว่างแล้ว": "Switched to light theme",
        "เปลี่ยนเป็นธีมมืดแล้ว": "Switched to dark theme",
        "เปิดตะกร้าสินค้า": "Open cart",
        "ตะกร้า": "Cart",
        "เปิดเมนูโปรไฟล์": "Open profile menu",
        "รูปโปรไฟล์ผู้ใช้": "User profile picture",
        "รูปโปรไฟล์": "Profile picture",
        "ผู้ใช้งาน": "User",
        "ผู้เยี่ยมชม": "Guest",
        "ยินดีต้อนรับกลับมา": "Welcome back",
        "เข้าสู่ระบบ / สมัครสมาชิก": "Sign in / Sign up",
        "ข้อมูลส่วนตัว": "Personal info",
        "ที่อยู่จัดส่ง": "Shipping address",
        "ประวัติการสั่งซื้อ": "Order history",
        "จัดการร้านค้า": "Manage store",
        "ออกจากระบบ": "Sign out",
        "ปิด": "Close",
        "บันทึก": "Save",
        "ลบ": "Remove",

        /* ---------- โปรโมชัน / Hero / จุดเด่น ---------- */
        "โปรโมชันส่งฟรี": "Free shipping promotion",
        "ส่งฟรีทั่วไทย": "Free shipping across Thailand",
        "เมื่อช้อปครบ ฿500": "on orders of ฿500+",
        "ส่งฟรีทั่วไทยเมื่อช้อปครบ 500 บาท": "Free shipping across Thailand on orders of 500 THB+",
        "แต่งตัวในสไตล์": "Dress in a style",
        "ที่เป็นคุณ": "that's you",
        "คัดสรรเสื้อผ้า รองเท้า และแอคเซสซอรีคุณภาพดี ดีไซน์เรียบง่าย ใส่ได้ทุกวัน ในราคาที่เอื้อมถึง":
            "Quality clothing, shoes and accessories with simple designs, made for every day at prices you can afford.",
        "ช้อปเลย": "Shop now",
        "ดูสินค้าทั้งหมด": "View all products",
        "สินค้าพร้อมส่ง": "Ready to ship",
        "บริการของร้าน": "Our services",
        "จัดส่งรวดเร็ว": "Fast delivery",
        "ได้รับสินค้าภายใน 1–3 วัน": "Arrives in 1–3 days",
        "เปลี่ยนไซส์ได้": "Easy size exchange",
        "ภายใน 7 วันหลังได้รับสินค้า": "Within 7 days of delivery",
        "เปลี่ยนไซส์ได้ภายใน 7 วัน": "Size exchange within 7 days",
        "ชำระเงินปลอดภัย": "Secure payment",
        "ชำระผ่าน KBank · SCB · PromptPay": "Pay via KBank · SCB · PromptPay",
        "ชำระเงินผ่าน PromptPay ปลอดภัย": "Secure payment via PromptPay",
        "ดูประวัติการสั่งซื้อได้ทุกเมื่อ": "View your order history anytime",
        "บันทึกที่อยู่เพื่อชำระเงินเร็วขึ้น": "Save your address for faster checkout",
        "สมัครฟรี ไม่มีค่าใช้จ่าย": "Free to sign up",

        /* ---------- แคตตาล็อก ---------- */
        "เลือกซื้อสินค้า": "Shop products",
        "เสื้อผ้า รองเท้า และแอคเซสซอรีที่คัดมาแล้ว ใส่ได้จริงในทุกวัน":
            "Hand-picked clothing, shoes and accessories for everyday wear.",
        "ค้นหาสินค้า": "Search products",
        "ค้นหาสินค้า...": "Search products...",
        "กรองตามหมวดหมู่": "Filter by category",
        "ไม่พบสินค้าที่ค้นหา": "No products found",
        "ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูอีกครั้ง": "Try a different search term or category.",
        "สินค้า": "Product",
        "ไซส์": "Size",
        "เพิ่มลงตะกร้า": "Add to cart",
        "สินค้าหมด": "Sold out",
        "สินค้าหมด · ไม่มีสินค้าคงเหลือ": "Sold out · No stock left",
        "บาท": "THB",

        /* ---------- ชื่อสินค้า ---------- */
        "เสื้อยืดสีขาว": "White T-shirt",
        "เสื้อยืดสีดำ": "Black T-shirt",
        "เสื้อ Polo": "Polo shirt",
        "เสื้อฮู้ดดี้": "Hoodie",
        "เสื้อเชิ้ตแขนยาว": "Long-sleeve shirt",
        "เสื้อกล้ามผู้หญิง": "Women's tank top",
        "เสื้อกล้ามผู้ชาย": "Men's tank top",
        "กางเกงยีนส์ขาสั้น": "Denim shorts",
        "กางเกงยีนส์ Baggy": "Baggy jeans",
        "กางเกงสแล็คชาย": "Men's slacks",
        "หมวกแก๊ปขาว": "White cap",
        "หมวกแก๊ปเขียว": "Green cap",
        "หมวกแก๊ปน้ำเงิน": "Navy cap",
        "หมวกแก๊ปครีม": "Cream cap",
        "เสื้อยืดคอกลมสีขาว": "White crew-neck T-shirt",
        "เสื้อเชิ้ตแขนยาวสีขาว": "White long-sleeve shirt",
        "เสื้อกล้ามสีขาว": "White tank top",
        "กางเกงออกกำลังกาย": "Workout pants",
        "กางเกงบอลลูน": "Balloon pants",
        "รองเท้าผ้าใบแฟชั่นสีขาว": "White fashion sneakers",
        "รองเท้าผ้าใบแฟชั่นสีชมพู": "Pink fashion sneakers",
        "รองเท้าผ้าใบแฟชั่นสีดำ-ขาว": "Black-white fashion sneakers",
        "รองเท้าวิ่งสีเทา": "Grey running shoes",
        "รองเท้าวิ่งสีขาว": "White running shoes",

        /* ---------- ตะกร้า ---------- */
        "ตะกร้าของฉัน": "My cart",
        "ตะกร้าสินค้า": "Shopping cart",
        "ยังไม่มีสินค้าในตะกร้า": "Your cart is empty",
        "เลือกสินค้าที่ถูกใจแล้วเพิ่มลงตะกร้าได้เลย": "Pick something you like and add it to your cart.",
        "กลับไปช้อปต่อ": "Continue shopping",
        "ล้างตะกร้า": "Clear cart",
        "ล้างตะกร้าเรียบร้อยแล้ว": "Cart cleared",
        "ราคารวม": "Total",
        "รวมภาษีแล้ว": "Tax included",
        "ดำเนินการชำระเงิน": "Checkout",
        "ช้อปอีก": "Spend",
        "เพื่อรับสิทธิ์ส่งฟรี": "more for free shipping",
        "ช้อปอีก ฿500 เพื่อรับสิทธิ์ส่งฟรี": "Spend ฿500 more for free shipping",
        "คุณได้รับสิทธิ์ส่งฟรีแล้ว": "You've got free shipping",
        "ลดจำนวน": "Decrease quantity",
        "เพิ่มจำนวน": "Increase quantity",
        "ครบจำนวนคงเหลือแล้ว": "Maximum available quantity reached",
        "กรุณาเลือกไซส์ก่อนเพิ่มลงตะกร้า": "Please choose a size before adding to cart",
        "กรุณาเลือกสินค้าก่อนสั่งซื้อ": "Please add products before ordering",
        "ไม่พบรายการสินค้าในตะกร้า": "No items in your cart",

        /* ---------- ชำระเงิน ---------- */
        "ชำระเงิน": "Payment",
        "ยอดที่ต้องชำระ": "Amount due",
        "เลือกธนาคาร": "Choose bank",
        "เลือกธนาคารที่โอน": "Choose the bank you transfer to",
        "กสิกรไทย": "KBank",
        "ไทยพาณิชย์": "SCB",
        "โลโก้ธนาคารกสิกรไทย": "KBank logo",
        "โลโก้ธนาคารไทยพาณิชย์": "SCB logo",
        "QR รับเงิน KBank": "KBank payment QR",
        "QR รับเงินไทยพาณิชย์": "SCB payment QR",
        "สแกน QR Code พร้อมเพย์": "Scan the PromptPay QR code",
        "สแกนจ่าย": "Scan to pay",
        "สแกนเพื่อชำระเงิน": "Scan to pay",
        "QR นี้ไม่ระบุยอดเงิน กรุณากรอกยอดตามที่แสดงด้านบน และตรวจสอบชื่อผู้รับในแอปธนาคารก่อนยืนยัน คำสั่งซื้อจะรอแอดมินตรวจสลิปก่อนหักสต๊อก":
            "This QR has no amount set. Enter the amount shown above and check the recipient name in your banking app before confirming. Your order waits for an admin to check the slip before stock is deducted.",
        "ตรวจสอบชื่อผู้รับในแอปธนาคารก่อนยืนยัน": "Check the recipient name in your banking app before confirming",
        "ชื่อบัญชี: นาย ภูมิพัฒน์ สร้อยพวงนาค": "Account name: นาย ภูมิพัฒน์ สร้อยพวงนาค",
        "ธนาคารกสิกรไทย: 178-8-96650-0": "KBank: 178-8-96650-0",
        "ธนาคารไทยพาณิชย์: 436-1-12060-2": "SCB: 436-1-12060-2",
        "คัดลอกเลขบัญชี": "Copy account number",
        "คัดลอกเลขบัญชีแล้ว": "Account number copied",
        "ไม่สามารถคัดลอกได้ กรุณาจดเลขบัญชีด้วยตนเอง": "Couldn't copy. Please note the account number manually.",
        "แนบสลิป": "Attach slip",
        "แนบหลักฐานการโอน": "Attach transfer proof",
        "หลักฐานการโอนเงิน": "Transfer proof",
        "แตะเพื่อแนบสลิป": "Tap to attach slip",
        "PNG, JPG หรือ WEBP ขนาดไม่เกิน 8 MB": "PNG, JPG or WEBP, up to 8 MB",
        "ตัวอย่างสลิปโอนเงิน": "Transfer slip preview",
        "สลิปโอนเงิน": "Transfer slip",
        "เปลี่ยนรูปสลิป": "Change slip image",
        "แนบหลักฐานเรียบร้อย": "Proof attached",
        "แนบหลักฐานเรียบร้อยแล้ว": "Proof attached",
        "ส่งสลิปเพื่อตรวจสอบ": "Submit slip for review",
        "กำลังส่งคำสั่งซื้อ...": "Submitting order...",
        "กรุณาแนบสลิปการโอนเงินก่อนยืนยัน": "Please attach your transfer slip before confirming",
        "กรุณาเริ่มขั้นตอนชำระเงินใหม่": "Please start checkout again",
        "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ": "Please sign in before ordering",
        "รอแอดมินตรวจสอบการชำระเงินก่อนตัดสต๊อก": "Waiting for an admin to verify payment before stock is deducted",
        "ยอดคำสั่งซื้อถูกปรับตามราคาที่ระบบกำหนด": "Order total was adjusted to the system price",
        "ไฟล์สลิปมีขนาดใหญ่เกิน 8 MB": "Slip file is larger than 8 MB",
        "ไฟล์สลิปต้องมีขนาดไม่เกิน 8 MB": "Slip file must be 8 MB or smaller",
        "ไม่สามารถอ่านไฟล์สลิปได้ กรุณาลองใหม่": "Couldn't read the slip file. Please try again.",
        "กรุณาเลือกไฟล์รูปภาพ PNG, JPG หรือ WEBP": "Please choose a PNG, JPG or WEBP image",
        "เบราว์เซอร์นี้ไม่รองรับการสร้างรหัสคำสั่งซื้อ": "This browser can't create an order ID",

        /* ---------- ใบเสร็จ / ประวัติคำสั่งซื้อ ---------- */
        "ส่งคำสั่งซื้อแล้ว": "Order submitted",
        "ส่งคำสั่งซื้อแล้ว แต่บันทึกประวัติในอุปกรณ์นี้ไม่สำเร็จ": "Order submitted, but saving history on this device failed",
        "ส่งคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่": "Couldn't submit the order. Please try again.",
        "ดูประวัติการสั่งซื้อ": "View order history",
        "ยอดรวมทั้งหมด": "Grand total",
        "กำลังโหลดประวัติคำสั่งซื้อ...": "Loading order history...",
        "ยังไม่มีประวัติการสั่งซื้อ": "No orders yet",
        "เมื่อคุณสั่งซื้อสำเร็จ รายการจะแสดงอยู่ที่นี่": "Your orders will appear here once you place one.",
        "รอแอดมินตรวจสอบ": "Waiting for admin review",
        "อนุมัติแล้ว": "Approved",
        "ปฏิเสธคำสั่งซื้อ": "Rejected",
        "ไม่ทราบสถานะ": "Unknown status",
        "แอดมินตรวจสอบและอนุมัติคำสั่งซื้อแล้ว": "An admin has reviewed and approved your order",
        "คำสั่งซื้อถูกปฏิเสธ กรุณาตรวจสอบประวัติคำสั่งซื้อ": "Your order was rejected. Please check your order history.",
        "โหลดประวัติคำสั่งซื้อไม่สำเร็จ": "Couldn't load order history",
        "โหลดประวัติคำสั่งซื้อจากฐานข้อมูลไม่สำเร็จ": "Couldn't load order history from the database",
        "ตรวจสอบบัญชีเพื่อโหลดประวัติคำสั่งซื้อไม่ได้": "Couldn't verify your account to load order history",
        "ข้อมูลประวัติคำสั่งซื้อไม่ถูกต้อง": "Order history data is invalid",

        /* ---------- โปรไฟล์ / ที่อยู่ ---------- */
        "บันทึกข้อมูลส่วนตัว": "Save personal info",
        "บัญชีผู้เยี่ยมชม": "Guest account",
        "เปลี่ยนรูปโปรไฟล์": "Change profile picture",
        "ชื่อ - นามสกุล": "Full name",
        "กรอกชื่อ-นามสกุล": "Enter your full name",
        "เช่น สมชาย ใจดี": "e.g. John Smith",
        "อีเมล": "Email",
        "กรอกอีเมล": "Enter your email",
        "อีเมลนี้ใช้เข้าสู่ระบบ ส่วนข้อมูลโปรไฟล์เพิ่มเติมและรูปภาพจะบันทึกไว้ในเบราว์เซอร์นี้":
            "This email is used to sign in. Extra profile details and your picture are saved in this browser.",
        "เบอร์โทรศัพท์": "Phone number",
        "หมายเลขโทรศัพท์": "Phone number",
        "วันเกิด": "Birthday",
        "เพศ": "Gender",
        "ชาย": "Male",
        "หญิง": "Female",
        "อื่นๆ": "Other",
        "เมื่อคลิกบันทึก แสดงว่าคุณรับทราบว่าคุณได้อ่าน": "By clicking save, you confirm you have read the",
        "นโยบายความเป็นส่วนตัว": "Privacy Policy",
        "แล้ว": "",
        "เลือกรูปโปรไฟล์แล้ว กดบันทึกเพื่อใช้งาน": "Profile picture selected. Press save to use it.",
        "ไฟล์รูปภาพมีขนาดใหญ่เกิน 8 MB": "Image file is larger than 8 MB",
        "ไม่สามารถอ่านรูปภาพได้ กรุณาเลือกรูปอื่น": "Couldn't read the image. Please choose another.",
        "ไม่สามารถอ่านไฟล์รูปภาพได้": "Couldn't read the image file",
        "กรุณากรอกชื่อ - นามสกุลอย่างน้อย 2 ตัวอักษร": "Please enter a full name of at least 2 characters",
        "กรุณากรอกเบอร์โทรศัพท์ 9 หลัก": "Please enter a 9-digit phone number",
        "กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูลส่วนตัว": "Please sign in before saving personal info",
        "บันทึกชื่อในระบบไม่สำเร็จ กรุณาลองใหม่": "Couldn't save your name. Please try again.",
        "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว": "Personal info saved",
        "ชื่อผู้รับ": "Recipient name",
        "ที่อยู่": "Address",
        "รายละเอียดที่อยู่": "Address details",
        "บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์":
            "House no., street, subdistrict, district, province, postal code",
        "ป้อนรายละเอียดอื่น ๆ (ไม่บังคับ)": "Other details (optional)",
        "แผนที่ตำแหน่งที่อยู่จัดส่ง": "Shipping address map",
        "ยืนยันตำแหน่งในแผนที่ของฉัน": "Confirm my location on the map",
        "กรุณากรอกชื่อผู้รับ": "Please enter the recipient name",
        "กรุณากรอกที่อยู่จัดส่ง": "Please enter a shipping address",
        "กรุณาเข้าสู่ระบบก่อนบันทึกที่อยู่จัดส่ง": "Please sign in before saving a shipping address",
        "บันทึกข้อมูลที่อยู่เรียบร้อยแล้ว": "Address saved",

        /* ---------- Footer ---------- */
        "ร้านจำหน่ายเสื้อผ้าแฟชั่นคุณภาพสูง ตอบโจทย์ทุกสไตล์ที่เป็นคุณ":
            "Quality fashion clothing for every style that's you.",
        "ออกแบบมาเพื่อทุกสไตล์ที่เป็นคุณ": "Designed for every style that's you",
        "ติดต่อเรา": "Contact us",
        "ติดตามเรา": "Follow us",
        "โซเชียลมีเดียของร้าน": "Our social media",
        "กรุงเทพมหานคร, ประเทศไทย": "Bangkok, Thailand",

        /* ---------- ล็อกอิน / สมัครสมาชิก ---------- */
        "สไตล์ที่ใช่": "The right style",
        "สำหรับทุกวัน": "for every day",
        "เริ่มต้นสไตล์ใหม่": "Start a new style",
        "ในแบบของคุณ": "your way",
        "เสื้อผ้าและแอคเซสซอรีที่คัดสรรมาแล้ว ดีไซน์เรียบง่าย ใส่ได้จริงในทุกวัน":
            "Hand-picked clothing and accessories with simple designs for everyday wear.",
        "เข้าสู่ระบบ": "Sign in",
        "เข้าสู่บัญชีเพื่อจัดการข้อมูล ที่อยู่ และประวัติการสั่งซื้อของคุณ":
            "Sign in to manage your details, addresses and order history.",
        "สมัครสมาชิก": "Sign up",
        "สมัครสมาชิกเพื่อเก็บข้อมูลการสั่งซื้อ จัดการที่อยู่ และช้อปได้รวดเร็วขึ้นในทุกครั้ง":
            "Sign up to keep your orders, manage addresses and check out faster every time.",
        "กรอกข้อมูลด้านล่างเพื่อเริ่มช้อปและจัดการบัญชีของคุณ": "Fill in the details below to start shopping and manage your account.",
        "ชื่อผู้ใช้": "Username",
        "3–30 ตัวอักษร ไม่มีช่องว่าง": "3–30 characters, no spaces",
        "รหัสผ่าน": "Password",
        "กรอกรหัสผ่าน": "Enter your password",
        "ยืนยันรหัสผ่าน": "Confirm password",
        "กรอกรหัสผ่านอีกครั้ง": "Enter your password again",
        "อย่างน้อย 6 ตัวอักษร": "At least 6 characters",
        "แสดง": "Show",
        "ซ่อน": "Hide",
        "แสดงรหัสผ่าน": "Show password",
        "ซ่อนรหัสผ่าน": "Hide password",
        "อ่อนมาก": "Very weak",
        "อ่อน": "Weak",
        "ปานกลาง": "Fair",
        "ดี": "Good",
        "แข็งแรง": "Strong",
        "ยังไม่มีบัญชี?": "Don't have an account?",
        "มีบัญชีอยู่แล้ว?": "Already have an account?",
        "การสมัครสมาชิกถือว่าคุณยอมรับนโยบายความเป็นส่วนตัว และข้อกำหนดการใช้งานของร้านค้า":
            "By signing up, you accept the store's Privacy Policy and Terms of Use.",
        "บัญชีเข้าสู่ระบบด้วย Supabase ส่วนข้อมูลโปรไฟล์เพิ่มเติมและประวัติคำสั่งซื้อยังเก็บไว้ในเบราว์เซอร์นี้":
            "Your account signs in with Supabase. Extra profile details and order history are kept in this browser.",
        "บัญชีและข้อมูลสมัครสมาชิกจะถูกเก็บใน Supabase ส่วนข้อมูลโปรไฟล์เพิ่มเติมและประวัติคำสั่งซื้อยังเก็บไว้ในเบราว์เซอร์นี้":
            "Your account and sign-up details are stored in Supabase. Extra profile details and order history are kept in this browser.",
        "กำลังเข้าสู่ระบบ...": "Signing in...",
        "กำลังสร้างบัญชี...": "Creating account...",
        "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน": "Please enter your email and password",
        "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง": "Incorrect email or password. Please try again.",
        "เข้าสู่ระบบสำเร็จ กำลังพาคุณไป...": "Signed in. Redirecting...",
        "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง": "Sign-in failed. Please try again.",
        "ชื่อผู้ใช้ต้องมี 3–30 ตัวอักษร และห้ามมีช่องว่าง": "Username must be 3–30 characters with no spaces",
        "รูปแบบอีเมลไม่ถูกต้อง เช่น example@email.com": "Invalid email format, e.g. example@email.com",
        "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง เช่น 0812345678": "Please enter a valid phone number, e.g. 0812345678",
        "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร": "Password must be at least 6 characters",
        "รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง": "Passwords don't match. Please check again.",
        "สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่": "Sign-up failed. Please check your details and try again.",
        "สมัครสำเร็จแล้ว กรุณายืนยันอีเมลจากกล่องจดหมายก่อนเข้าสู่ระบบ": "Signed up! Please confirm your email from your inbox before signing in.",
        "สมัครสมาชิกสำเร็จ กำลังพาคุณไป...": "Signed up. Redirecting...",
        "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง": "Sign-up failed. Please try again.",
        "ตรวจสอบสถานะการเข้าสู่ระบบไม่ได้ กรุณารีเฟรชหน้า": "Couldn't check your sign-in status. Please refresh the page.",
        "ตรวจสอบสิทธิ์บัญชีไม่ได้ กรุณาลองใหม่": "Couldn't verify account permissions. Please try again.",
        "ไม่สามารถตรวจสอบสิทธิ์บัญชีได้ กรุณาลองใหม่": "Couldn't verify account permissions. Please try again.",
        "ออกจากระบบเรียบร้อยแล้ว": "Signed out",
        "ออกจากระบบไม่สำเร็จ กรุณาลองใหม่": "Sign-out failed. Please try again.",
        "ออกจากระบบในอุปกรณ์นี้แล้ว แต่ยืนยันกับเซิร์ฟเวอร์ไม่สำเร็จ": "Signed out on this device, but the server didn't confirm",

        /* ---------- Error จากระบบ ---------- */
        "ยังไม่ได้ตั้งค่า Supabase": "Supabase is not configured",
        "Project URL ของ Supabase ไม่ถูกต้อง": "Supabase Project URL is invalid",
        "Project URL ต้องใช้ HTTPS": "Project URL must use HTTPS",
        "ข้อมูลบัญชีจาก Supabase ไม่ครบถ้วน": "Account data from Supabase is incomplete",
        "ไม่พบบัญชีที่เข้าสู่ระบบ": "No signed-in account found",
        "ตรวจสอบบัญชีไม่ได้ กรุณาเข้าสู่ระบบใหม่": "Couldn't verify your account. Please sign in again.",
        "ตรวจสอบบัญชีไม่สำเร็จ กรุณาลองใหม่": "Account check failed. Please try again.",
        "ข้อมูลบัญชีไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่": "Account data is invalid. Please sign in again.",
        "ระบบคำสั่งซื้อยังไม่พร้อมใช้งาน": "The order system isn't ready yet",
        "รหัสคำสั่งซื้อไม่ถูกต้อง": "Invalid order ID",
        "ไม่พบรายการสินค้าในคำสั่งซื้อ": "No items found in the order",
        "กรุณาเลือกธนาคารที่ถูกต้อง": "Please choose a valid bank",
        "ข้อมูลสินค้าในคำสั่งซื้อไม่ถูกต้อง": "Order item data is invalid",
        "อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่": "Slip upload failed. Please try again.",
        "บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาตรวจสอบสต๊อกและลองใหม่": "Couldn't save the order. Please check stock and try again.",
        "ได้รับข้อมูลคำสั่งซื้อไม่ถูกต้อง กรุณาตรวจสอบประวัติคำสั่งซื้อ": "Received invalid order data. Please check your order history.",
        "โหลดรายการสินค้าในคำสั่งซื้อไม่สำเร็จ": "Couldn't load order items",
        "ข้อมูลรายการคำสั่งซื้อไม่ถูกต้อง": "Order item data is invalid",
        "ยอดรวมคำสั่งซื้อไม่ตรงกับรายการสินค้า": "Order total doesn't match its items",
        "ไม่สามารถเชื่อมต่อฐานข้อมูลสต๊อกได้": "Couldn't connect to the stock database",
        "โหลดสต๊อกจากฐานข้อมูลไม่สำเร็จ": "Couldn't load stock from the database",
        "ข้อมูลสต๊อกในฐานข้อมูลไม่ถูกต้อง": "Stock data in the database is invalid",
        "ข้อมูลสต๊อกในฐานข้อมูลไม่ครบ กรุณาตรวจสอบการตั้งค่าฐานข้อมูล": "Stock data in the database is incomplete. Please check the database setup.",
        "โหลดสต๊อกล่าสุดไม่ได้ ข้อมูลที่แสดงอาจไม่เป็นปัจจุบัน": "Couldn't load the latest stock. What you see may be out of date."
    };

    // ข้อความที่มีส่วนเปลี่ยนได้: {} ฝั่งไทย ↔ {0}, {1} ฝั่งอังกฤษ
    const EN_TEMPLATES = {
        "{} ชิ้น": "{0} pcs",
        "{} บาท": "{0} THB",
        "{} บาท / ชิ้น": "{0} THB / pc",
        "{} รายการ": "{0} items",
        "คงเหลือ {} ชิ้น": "{0} left",
        "สินค้าเหลือเพียง {} ชิ้น": "Only {0} left",
        "เลือกไซส์ · คงเหลือรวม {} ชิ้น": "Choose a size · {0} left in total",
        "ไซส์ {} · เหลือ {} ชิ้น": "Size {0} · {1} left",
        "ไซส์ {} สินค้าหมดแล้ว": "Size {0} is sold out",
        "ไซส์ {} หมดแล้ว": "Size {0} sold out",
        "· ไซส์ {}": "· Size {0}",
        "{} · ไซส์ {}": "{0} · Size {1}",
        "เพิ่ม “{}” ไซส์ {} ลงตะกร้าแล้ว": "Added “{0}” size {1} to cart",
        "เพิ่ม “{}” ลงตะกร้าแล้ว": "Added “{0}” to cart",
        "เพิ่ม {} ลงตะกร้า": "Add {0} to cart",
        "{} สินค้าหมด": "{0} sold out",
        "{} · สินค้าหมด": "{0} · Sold out",
        "{} · พร้อมส่ง": "{0} · In stock",
        "ลบ {} ไซส์ {} ออกจากตะกร้า": "Remove {0} size {1} from cart",
        "ลบ {} ออกจากตะกร้า": "Remove {0} from cart",
        "เพิ่มครบจำนวนคงเหลือ {} ชิ้นแล้ว": "All {0} available have been added",
        "สินค้า “{}” หมดแล้ว": "“{0}” is sold out",
        "สินค้า “{}” เหลือเพียง {} ชิ้น": "Only {1} of “{0}” left",
        "ความปลอดภัยของรหัสผ่าน: {}": "Password strength: {0}",
        "รหัส: {}": "ID: {0}"
    };

    const templates = Object.entries(EN_TEMPLATES)
        .map(([thai, english]) => {
            const pattern = thai.split("{}")
                .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                .join("(.+?)");
            return { regex: new RegExp(`^${pattern}$`), english, literalLength: thai.replace(/\{\}/g, "").length };
        })
        // ลองแม่แบบที่เจาะจงกว่า (ข้อความคงที่ยาวกว่า) ก่อน
        .sort((a, b) => b.literalLength - a.literalLength);

    function translateCore(text) {
        if (Object.prototype.hasOwnProperty.call(EN, text)) return EN[text];
        for (const { regex, english } of templates) {
            const match = text.match(regex);
            if (!match) continue;
            const args = match.slice(1).map((arg) => (
                Object.prototype.hasOwnProperty.call(EN, arg) ? EN[arg] : arg
            ));
            return english.replace(/\{(\d+)\}/g, (_, index) => args[Number(index)]);
        }
        return null;
    }

    // แปลข้อความ คงช่องว่างหน้า/หลังไว้ คืนค่าเดิมถ้าไม่มีคำแปล
    function translate(text) {
        if (!THAI.test(text)) return text;
        const key = text.replace(/\s+/g, " ").trim();
        const translated = translateCore(key);
        if (translated === null) return text;
        const leading = text.match(/^\s*/)[0];
        const trailing = text.match(/\s*$/)[0];
        return leading + translated + trailing;
    }

    let currentLang = "th";
    try {
        currentLang = localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "th";
    } catch {
        // ใช้ภาษาไทยถ้าเบราว์เซอร์ไม่ให้อ่าน localStorage
    }

    // จำข้อความต้นฉบับของแต่ละ node/attribute เพื่อสลับกลับเป็นไทยได้
    // record = { source: ข้อความไทย, output: ข้อความที่เราใส่ลงไป }
    const textRecords = new WeakMap();
    const attributeRecords = new WeakMap();

    function applyToText(node) {
        const record = textRecords.get(node);
        const isOurOutput = record && record.output === node.data;
        const source = isOurOutput ? record.source : node.data;
        const output = currentLang === "en" ? translate(source) : source;

        if (output !== source) textRecords.set(node, { source, output });
        else textRecords.delete(node);
        if (node.data !== output) node.data = output;
    }

    function applyToAttribute(element, name) {
        const value = element.getAttribute(name);
        if (value === null) return;
        let records = attributeRecords.get(element);
        const record = records && records[name];
        const isOurOutput = record && record.output === value;
        const source = isOurOutput ? record.source : value;
        const output = currentLang === "en" ? translate(source) : source;

        if (output !== source) {
            if (!records) attributeRecords.set(element, records = {});
            records[name] = { source, output };
        } else if (records) {
            delete records[name];
        }
        if (value !== output) element.setAttribute(name, output);
    }

    function applyToTree(root) {
        if (root.nodeType === Node.TEXT_NODE) {
            applyToText(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        for (let node = root; node; node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                const parentTag = node.parentNode && node.parentNode.nodeName;
                if (parentTag !== "SCRIPT" && parentTag !== "STYLE") applyToText(node);
            } else {
                for (const name of TRANSLATED_ATTRIBUTES) {
                    if (node.hasAttribute(name)) applyToAttribute(node, name);
                }
            }
        }
    }

    function applyLanguage() {
        document.documentElement.lang = currentLang;
        applyToTree(document.documentElement);

        // ปุ่มแสดงภาษาที่ใช้อยู่ตอนนี้ ส่วน aria-label/title บอกว่ากดแล้วจะเปลี่ยนเป็นภาษาอะไร
        const isEnglish = currentLang === "en";
        const label = isEnglish ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English";
        document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
            button.textContent = isEnglish ? "EN" : "TH";
            button.setAttribute("aria-label", label);
            button.setAttribute("title", label);
        });
    }

    function toggleLanguage() {
        currentLang = currentLang === "en" ? "th" : "en";
        try {
            localStorage.setItem(STORAGE_KEY, currentLang);
        } catch {
            // ยังสลับภาษาได้ในหน้านี้แม้บันทึกไม่ได้
        }
        applyLanguage();
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "characterData") {
                applyToText(mutation.target);
            } else if (mutation.type === "attributes") {
                applyToAttribute(mutation.target, mutation.attributeName);
            } else {
                mutation.addedNodes.forEach(applyToTree);
            }
        }
    });

    applyLanguage();
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: TRANSLATED_ATTRIBUTES
    });

    global.toggleLanguage = toggleLanguage;
    // ใช้ตอนค้นหาสินค้า ให้พิมพ์ชื่อภาษาอังกฤษแล้วเจอได้
    global.translateText = (text) => (currentLang === "en" ? translate(text) : text);
})(window);
