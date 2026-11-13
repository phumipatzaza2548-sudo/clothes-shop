/* ==================== Login / Register ==================== */
(function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const messageBox = document.getElementById("auth-message");

    let supabaseClient = null;
    let supabaseConfigError = null;
    try {
        supabaseClient = getSharedSupabaseClient();
    } catch (error) {
        supabaseConfigError = error;
    }

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

    function goToPage(page) {
        window.location.assign(page);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
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

            const email = loginForm.elements.email.value.trim();
            const password = loginForm.elements.password.value;

            if (!email || !password) {
                showMessage("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
                return;
            }

            setButtonBusy(submitButton, true, "กำลังเข้าสู่ระบบ...");

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });
                if (error || !data.user) {
                    showMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง");
                    return;
                }

                const destination = await getAuthLandingPage(supabaseClient);
                upsertShopUserFromAuthUser(data.user);
                showMessage("เข้าสู่ระบบสำเร็จ กำลังพาคุณไป...", "success");
                window.setTimeout(() => goToPage(destination), 450);
            } catch (error) {
                console.error("Login error:", error);
                showMessage(error.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setButtonBusy(submitButton, false, "");
            }
        });

        loginForm.addEventListener("input", clearMessage);
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

            setButtonBusy(submitButton, true, "กำลังสร้างบัญชี...");

            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username, fullname, phone },
                        emailRedirectTo: `${window.location.origin}/index.html`
                    }
                });
                if (error || !data.user) {
                    showMessage("สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่");
                    return;
                }

                if (!data.session) {
                    showMessage("สมัครสำเร็จแล้ว กรุณายืนยันอีเมลจากกล่องจดหมายก่อนเข้าสู่ระบบ", "success");
                    return;
                }

                const destination = await getAuthLandingPage(supabaseClient);
                upsertShopUserFromAuthUser(data.user);
                showMessage("สมัครสมาชิกสำเร็จ กำลังพาคุณไป...", "success");
                window.setTimeout(() => goToPage(destination), 450);
            } catch (error) {
                console.error("Register error:", error);
                showMessage(error.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setButtonBusy(submitButton, false, "");
            }
        });

        registerForm.addEventListener("input", clearMessage);
    }

    if (!supabaseClient) {
        showMessage(supabaseConfigError?.message || "ยังไม่ได้ตั้งค่า Supabase", "error");
        document.querySelectorAll(".auth-submit").forEach((button) => {
            button.disabled = true;
        });
        return;
    }

    async function redirectExistingSession() {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
            showMessage("ตรวจสอบสถานะการเข้าสู่ระบบไม่ได้ กรุณารีเฟรชหน้า", "error");
            return;
        }
        if (!data.session?.user) return;

        try {
            const destination = await getAuthLandingPage(supabaseClient);
            upsertShopUserFromAuthUser(data.session.user);
            goToPage(destination);
        } catch (error) {
            console.error("Session role check failed:", error);
            showMessage(error.message || "ตรวจสอบสิทธิ์บัญชีไม่ได้ กรุณาลองใหม่");
        }
    }

    redirectExistingSession();
})();
