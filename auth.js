/* ==================== Login / Register ==================== */
(function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const demoButton = document.getElementById("demo-login");
    const messageBox = document.getElementById("auth-message");

    let demoAccountReady = ensureDemoAccount();

    /* ---------- Shared helpers ---------- */
    function showMessage(message, type = "error") {
        if (!messageBox) return;
        messageBox.textContent = message;
        messageBox.className = `auth-message is-visible ${type === "success" ? "is-success" : "is-error"}`;
    }

    function clearMessage() {
        if (!messageBox) return;
        messageBox.textContent = "";
        messageBox.className = "auth-message";
    }

    function setButtonBusy(button, isBusy, busyText) {
        if (!button) return;
        const label = button.querySelector("[data-button-label]");
        const idleText = button.dataset.idleText || (label ? label.textContent : button.textContent);

        button.disabled = isBusy;
        button.classList.toggle("is-loading", isBusy);
        if (label) label.textContent = isBusy ? busyText : idleText;
    }

    function goToShop() {
        window.location.href = "shop.html";
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    async function ensureDemoAccount() {
        let users = getShopUsers();
        const demoIndex = users.findIndex((user) => normalizeIdentity(user.username) === "demo");
        const passwordHash = await hashPassword("123456");

        if (demoIndex >= 0) {
            if (!users[demoIndex].passwordHash) {
                users[demoIndex].passwordHash = passwordHash;
                saveShopUsers(users);
            }
            return;
        }

        users = [{
            username: "demo",
            fullname: "ผู้ใช้ทดลอง",
            email: "demo@myclothingshop.test",
            phone: "0812345678",
            passwordHash,
            gender: "",
            birthdate: "",
            avatar: "",
            address: {},
            createdAt: Date.now()
        }, ...users];

        saveShopUsers(users);
    }

    /* ---------- Password visibility ---------- */
    document.querySelectorAll(".password-toggle").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.target);
            if (!input) return;

            const showPassword = input.type === "password";
            input.type = showPassword ? "text" : "password";
            button.textContent = showPassword ? "ซ่อน" : "แสดง";
            button.setAttribute("aria-label", showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน");
        });
    });

    /* ---------- Password strength ---------- */
    const passwordInput = document.getElementById("reg-password");
    const strengthWrap = document.getElementById("password-strength");
    const strengthBar = document.getElementById("password-strength-bar");
    const strengthText = document.getElementById("password-strength-text");

    function renderPasswordStrength() {
        if (!passwordInput || !strengthWrap || !strengthBar || !strengthText) return;

        const password = passwordInput.value;
        strengthWrap.classList.toggle("is-visible", password.length > 0);

        if (!password) {
            strengthBar.style.width = "0";
            strengthBar.dataset.level = "0";
            strengthText.textContent = "";
            return;
        }

        let score = 0;
        if (password.length >= 6) score += 1;
        if (password.length >= 10) score += 1;
        if (/[a-zA-Zก-๙]/.test(password) && /\d/.test(password)) score += 1;
        if (/[^a-zA-Z0-9ก-๙]/.test(password)) score += 1;

        const levels = [
            { label: "อ่อนมาก", width: "18%" },
            { label: "อ่อน", width: "38%" },
            { label: "ปานกลาง", width: "62%" },
            { label: "ดี", width: "80%" },
            { label: "แข็งแรง", width: "100%" }
        ];

        const level = levels[Math.min(score, 4)];
        strengthBar.style.width = level.width;
        strengthBar.dataset.level = String(score);
        strengthText.textContent = `ความปลอดภัยของรหัสผ่าน: ${level.label}`;
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", renderPasswordStrength);
        renderPasswordStrength();
    }

    /* ---------- Login ---------- */
    if (loginForm) {
        const submitButton = document.getElementById("login-submit");
        if (submitButton) submitButton.dataset.idleText = "เข้าสู่ระบบ";

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearMessage();

            const identity = loginForm.elements.username.value.trim();
            const password = loginForm.elements.password.value;

            if (!identity || !password) {
                showMessage("กรุณากรอกชื่อผู้ใช้หรืออีเมล และรหัสผ่านให้ครบถ้วน");
                return;
            }

            setButtonBusy(submitButton, true, "กำลังเข้าสู่ระบบ...");

            try {
                await demoAccountReady;
                const user = findShopUser(identity);

                if (!user) {
                    showMessage("ไม่พบบัญชีนี้ในระบบ กรุณาตรวจสอบข้อมูลหรือสมัครสมาชิกก่อนเข้าใช้งาน");
                    return;
                }

                const passwordHash = await hashPassword(password);
                if (user.passwordHash !== passwordHash) {
                    showMessage("รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง");
                    return;
                }

                setCurrentUsername(user.username);
                showMessage("เข้าสู่ระบบสำเร็จ กำลังพาคุณไปที่ร้านค้า...", "success");
                window.setTimeout(goToShop, 650);
            } catch (error) {
                console.error("Login error:", error);
                showMessage("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setButtonBusy(submitButton, false, "");
            }
        });

        loginForm.addEventListener("input", clearMessage);

        if (demoButton) {
            demoButton.addEventListener("click", async () => {
                clearMessage();
                demoButton.disabled = true;
                const originalText = demoButton.textContent;
                demoButton.textContent = "กำลังเตรียมบัญชีทดลอง...";

                try {
                    await demoAccountReady;
                    loginForm.elements.username.value = "demo";
                    loginForm.elements.password.value = "123456";
                    showMessage("กรอกบัญชีทดลองให้แล้ว กำลังเข้าสู่ระบบ...", "success");
                    window.setTimeout(() => loginForm.requestSubmit(), 250);
                } catch (error) {
                    console.error("Demo account error:", error);
                    demoButton.disabled = false;
                    demoButton.textContent = originalText;
                    showMessage("ไม่สามารถเตรียมบัญชีทดลองได้ กรุณาลองใหม่");
                }
            });
        }
    }

    /* ---------- Register ---------- */
    if (registerForm) {
        const submitButton = document.getElementById("register-submit");
        if (submitButton) submitButton.dataset.idleText = "สมัครสมาชิก";

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearMessage();

            const fullname = registerForm.elements.fullname.value.trim();
            const username = registerForm.elements.username.value.trim();
            const email = registerForm.elements.email.value.trim();
            const phone = registerForm.elements.phone.value.replace(/[^0-9]/g, "");
            const password = registerForm.elements.password.value;
            const confirmPassword = registerForm.elements.confirmPassword.value;

            if (!fullname || fullname.length < 2) {
                showMessage("กรุณากรอกชื่อ - นามสกุลอย่างน้อย 2 ตัวอักษร");
                return;
            }

            if (username.length < 3 || username.length > 30 || /\s/.test(username)) {
                showMessage("ชื่อผู้ใช้ต้องมี 3–30 ตัวอักษร และห้ามมีช่องว่าง");
                return;
            }

            if (!isValidEmail(email)) {
                showMessage("รูปแบบอีเมลไม่ถูกต้อง เช่น example@email.com");
                return;
            }

            if (!/^0\d{8,9}$/.test(phone)) {
                showMessage("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง เช่น 0812345678");
                return;
            }

            if (password.length < 6) {
                showMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
                return;
            }

            const users = getShopUsers();
            const usernameExists = users.some((user) => normalizeIdentity(user.username) === normalizeIdentity(username));
            if (usernameExists) {
                showMessage("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น");
                return;
            }

            const emailExists = users.some((user) => normalizeIdentity(user.email) === normalizeIdentity(email));
            if (emailExists) {
                showMessage("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ");
                return;
            }

            setButtonBusy(submitButton, true, "กำลังสร้างบัญชี...");

            try {
                const passwordHash = await hashPassword(password);
                const newUser = {
                    username,
                    fullname,
                    email,
                    phone,
                    passwordHash,
                    gender: "",
                    birthdate: "",
                    avatar: "",
                    address: {},
                    createdAt: Date.now()
                };

                users.push(newUser);
                saveShopUsers(users);
                setCurrentUsername(username);
                showMessage("สมัครสมาชิกสำเร็จ กำลังพาคุณไปที่ร้านค้า...", "success");
                window.setTimeout(goToShop, 800);
            } catch (error) {
                console.error("Register error:", error);
                showMessage("เกิดข้อผิดพลาดในการสร้างบัญชี กรุณาลองใหม่อีกครั้ง");
            } finally {
                setButtonBusy(submitButton, false, "");
            }
        });

        registerForm.addEventListener("input", clearMessage);
    }
})();
