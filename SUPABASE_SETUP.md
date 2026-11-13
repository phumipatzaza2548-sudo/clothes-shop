# ตั้งค่า Supabase สำหรับหลังบ้าน

## สถานะปัจจุบัน

หน้าล็อกอินและสมัครสมาชิกของร้านค้า รวมถึงหน้าแอดมิน ใช้ Supabase Auth ชุดเดียวกัน ลูกค้าล็อกอินแล้วจะไปหน้าร้าน ส่วนบัญชีที่มี role `admin` จะไปหน้าแอดมินโดยอัตโนมัติ

บัญชีลูกค้า/บัญชีทดลองที่เคยเก็บไว้ในเบราว์เซอร์ยังไม่ได้สร้างใน Supabase ผู้ใช้เดิมต้องสมัครใหม่ด้วยอีเมล รหัสผ่านเดิมในเบราว์เซอร์จะไม่ถูกใช้แล้ว โปรไฟล์ยังเก็บในเบราว์เซอร์เดิม ส่วนคำสั่งซื้อใหม่และสถานะเก็บใน Supabase

หน้าร้านโหลดจำนวนสต๊อกจาก Supabase เมื่อเปิดหน้าและเมื่อกลับมาที่แท็บ ลูกค้าต้องล็อกอินก่อนสั่งซื้อ คำสั่งซื้อที่ส่งพร้อมสลิปจะรอแอดมินตรวจสอบ และจะหักสต๊อกแบบ atomic เมื่อแอดมินอนุมัติเท่านั้น การตรวจสลิปและยืนยันยอดโอนยังเป็นงานของแอดมิน ไม่ใช่การยืนยันชำระเงินอัตโนมัติ

## ตั้งค่าระบบ

1. สร้างโปรเจกต์ Supabase และเปิด SQL Editor
2. รันไฟล์ `supabase/stock-schema.sql` เพื่อสร้างตารางสต๊อก, สิทธิ์, RLS policy และข้อมูลตั้งต้น ไฟล์นี้รองรับตารางเดิมโดยเพิ่ม `updated_at` หากยังไม่มี, ถอด foreign key เก่าจาก `product_stock.product_id` ไปยัง `products` เพราะแคตตาล็อกของเว็บอยู่ในโค้ด, และจำกัดรหัสสินค้าให้อยู่ในช่วง 1–24 หากมีไซส์เสื้อเดิมเป็นตัวพิมพ์เล็ก (`s`, `m`, `l`, `xl`) สคริปต์จะแปลงเป็นตัวพิมพ์ใหญ่ และเมื่อมีแถวซ้ำจะเก็บจำนวนจากแถวตัวพิมพ์เล็กไว้
3. สร้างผู้ใช้แอดมินใน Supabase Authentication ด้วยวิธีเชิญหรือสร้างโดยเจ้าของโปรเจกต์ จากนั้นเพิ่ม UUID ของผู้ใช้ที่เชื่อถือได้ลงใน `public.user_roles` ผ่าน SQL Editor:

   ```sql
   insert into public.user_roles (user_id, role)
   values ('ใส่-UUID-ผู้ใช้-แอดมิน', 'admin');
   ```

   อย่าเปิดให้ผู้ใช้สมัครหรือแก้ role แอดมินด้วยตัวเอง
4. คัดลอก Project URL และ Publishable key จากหน้า Connect ของ Supabase มาใส่ใน `supabase-config.js`
5. ใน Supabase Auth เปิดการสมัครด้วยอีเมล ตั้งค่า **Site URL** และเพิ่ม URL ปลายทางที่อนุญาตใน **URL Configuration → Redirect URLs** เช่น `http://127.0.0.1:5500/index.html` (เปลี่ยน host/port ให้ตรงกับ Live Server) และ URL จริงเมื่อเผยแพร่ การยืนยันอีเมลจะกลับไปหน้า `index.html`
6. เปิดเว็บผ่าน local web server หรือ HTTPS (ไม่เปิดผ่าน `file://`) ลูกค้าใช้หน้า `register.html` สมัครและยืนยันอีเมล จากนั้นเข้าระบบที่ `index.html` ด้วยอีเมล/รหัสผ่านเดียวกัน
7. บัญชีแอดมินเข้าผ่านหน้าล็อกอินเดียวกันได้ ระบบจะพาไป `admin.html` เมื่อ role ผ่านการตรวจสอบ หรือเปิด `admin.html` โดยตรงก็ได้
8. เปิด SQL Editor แล้วรัน `supabase/order-schema.sql` หลังจาก `stock-schema.sql` สำเร็จ ไฟล์นี้สร้างตารางคำสั่งซื้อ, RPC สำหรับส่ง/อนุมัติ/ปฏิเสธคำสั่งซื้อ และ private bucket สำหรับสลิป
9. ติดตั้ง Supabase CLI หากยังไม่มี จากนั้น link โปรเจกต์และ deploy ฟังก์ชันลบสลิปที่หมดอายุ:

   ```text
   supabase link --project-ref <project-ref>
   supabase functions deploy cleanup-expired-slips
   ```

10. ใน Supabase Dashboard → **Database → Extensions** เปิด `pg_cron`, `pg_net` และ `supabase_vault` หากยังไม่เปิด จากนั้นเพิ่ม Project URL และ **Secret key** ของโปรเจกต์ลงใน Vault ผ่าน SQL Editor (เปลี่ยน placeholder ก่อนรัน; รันครั้งเดียว):

    ```sql
    select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
    select vault.create_secret('<Supabase Secret key>', 'secret_key');
    ```

    Secret key ใช้เฉพาะใน Vault สำหรับงานตั้งเวลาเท่านั้น ห้ามใส่ในไฟล์เว็บหรือส่งให้ผู้อื่น
11. ตั้งงานลบสลิปที่หมดอายุทุกชั่วโมงใน SQL Editor (หากรันซ้ำ ให้ลบงานเดิมก่อน):

    ```sql
    select cron.unschedule(jobid)
    from cron.job
    where jobname = 'delete-expired-payment-slips';

    select cron.schedule(
        'delete-expired-payment-slips',
        '0 * * * *',
        $$
        select net.http_post(
            url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
                || '/functions/v1/cleanup-expired-slips',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'apikey', (select decrypted_secret from vault.decrypted_secrets where name = 'secret_key')
            ),
            body := '{}'::jsonb
        );
        $$
    );
    ```

    สิทธิ์ดูสลิปจะหมดอายุหลัง 15 วัน และงานนี้จะลบไฟล์จริงภายในชั่วโมงถัดไป รวมถึงไฟล์ที่อัปโหลดค้างไว้แต่สร้างคำสั่งซื้อไม่สำเร็จ เก็บสิทธิ์ฐานข้อมูลไว้กับผู้ดูแลที่เชื่อถือได้เท่านั้น

Publishable key ถูกออกแบบให้ใช้ในหน้าเว็บได้ แต่ **ห้ามใส่ Secret key หรือ service-role key** ในไฟล์หน้าเว็บหรือส่งให้ผู้ใช้ เพราะ key ระดับนั้นข้าม RLS ได้

## การควบคุมสิทธิ์

- หน้าร้านแสดงลิงก์จัดการร้านค้าเฉพาะบัญชีที่ `public.is_admin()` ยืนยันว่าเป็นแอดมิน
- หน้าแอดมินตรวจสิทธิ์ซ้ำก่อนแสดงตาราง และ RLS ป้องกันการเปลี่ยนสต๊อกจากบัญชีลูกค้า
- ตารางเปิดให้อ่านจำนวนสต๊อกได้ แต่ RLS อนุญาตให้อัปเดตเฉพาะบัญชีที่มี role `admin`
- การเติมสต๊อกใช้ `public.restock_product()` ซึ่งตรวจจำนวนซ้ำที่ฐานข้อมูล
- หน้าร้านอ่านจำนวนสต๊อกจาก `product_stock` ใน Supabase; หากเติมสต๊อกจากหน้าแอดมินแล้วหน้าร้านเปิดค้างอยู่ ให้สลับกลับมาที่แท็บหน้าร้านหรือรีเฟรชหน้าเพื่อโหลดจำนวนล่าสุด
- คำสั่งซื้อเขียนผ่าน `public.submit_store_order()` เฉพาะผู้ใช้ที่ล็อกอิน; ผู้ใช้แก้สถานะหรือสต๊อกโดยตรงไม่ได้
- แอดมินอนุมัติผ่าน `public.approve_store_order()` ซึ่งล็อกแถวสต๊อก ตรวจยอดคงเหลือ และหักสต๊อกในธุรกรรมเดียว หากมีหลายคำสั่งซื้อรอสินค้าชิ้นสุดท้าย คำสั่งซื้อที่อนุมัติทีหลังจะไม่ผ่านและต้องปฏิเสธ
- สลิปอยู่ใน private bucket; ลูกค้าดูได้เฉพาะสลิปของตน แอดมินดูได้เฉพาะช่วง 15 วัน และลบจริงด้วย Edge Function ที่ตั้งเวลาไว้
- Supabase Auth บันทึก session ใน browser storage เพื่อใช้ร่วมกันระหว่างหน้าร้านและหน้าแอดมิน ให้ออกจากระบบเมื่อใช้เครื่องสาธารณะ
- โปรไฟล์และคำสั่งซื้อเก่าที่ยังอยู่ใน browser storage ไม่ได้ย้ายขึ้น Supabase; คำสั่งซื้อใหม่ผูกกับบัญชีที่ล็อกอิน

เอกสารอ้างอิง:

- [Supabase JavaScript client installation](https://supabase.com/docs/reference/javascript/installing)
- [Supabase password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Supabase sign up](https://supabase.com/docs/reference/javascript/auth-signup)
- [Supabase sign out](https://supabase.com/docs/reference/javascript/auth-signout)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage upload](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Supabase signed URLs](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl)
- [Supabase Database functions](https://supabase.com/docs/guides/database/functions)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [Supabase Vault](https://supabase.com/docs/guides/database/vault)
- [Deploying Edge Functions](https://supabase.com/docs/guides/functions/deploy)
