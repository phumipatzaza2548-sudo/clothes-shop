# โครงสร้างไฟล์ภาพและไอคอน

```
assets/
├─ icons/
│  ├─ ui/        ไอคอนอินเทอร์เฟซ (SVG) — ใช้ผ่าน CSS mask และรับสีจาก currentColor
│  └─ social/    ไอคอนโซเชียลมีเดีย (Facebook, Instagram, TikTok, Line)
└─ images/
   ├─ products/  ภาพสินค้าพื้นหลังโปร่งใสสำหรับแสดงบนพื้นสีขาว (p01.webp – p24.webp)
   │  └─ source/ ภาพต้นฉบับก่อนตัดพื้นหลัง (p01-source.jpg – p24-source.jpg)
   ├─ brand/     โลโก้ธนาคาร (kbank.jpg, scb.jpg)
   └─ avatars/   รูปโปรไฟล์เริ่มต้น (user.jpg)
```

## หมายเหตุการใช้งาน

- ภาพสินค้า `pXX.webp` เป็นไฟล์ขนาด 1000×1000 px พื้นหลังโปร่งใส ใช้คู่กับพื้นหลังสีขาวของ `.product-media`
- ไอคอนใน `icons/` ถูกเรียกใช้ใน `style.css` ผ่านตัวแปร `--ui-icon` จึงเปลี่ยนสีตามธีมได้อัตโนมัติ
- ไอคอนถูกฝังเป็น data URI ใน `style.css` เพื่อให้แสดงผลได้แม้เปิดเว็บผ่าน `file://` (Chrome ไม่อนุญาตให้ CSS mask โหลดไฟล์ SVG ภายนอก)
- หากแก้ไขไฟล์ SVG ให้รัน `node assets/icons/build-masks.mjs` เพื่ออัปเดต data URI ใน `style.css`
- หากเพิ่มสินค้าใหม่ ให้เพิ่มภาพที่ `images/products/` และอัปเดตข้อมูลใน `app.js`
- ภาพต้นฉบับใน `source/` เก็บไว้เพื่อแก้ไขหรือสร้างภาพสินค้าใหม่ในอนาคต
