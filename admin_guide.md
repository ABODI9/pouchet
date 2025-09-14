# Admin Guide / دليل الأدمين / Yönetici Kılavuzu

This document provides guidelines for administrators on how to manage and operate the project. The instructions are provided in English, Arabic, and Turkish.

---

## English

### 1. Project Monitoring and Maintenance
- **Docker Containers Management**: Use the command `docker ps` to monitor running containers.
- **Logs Verification**: Check logs for errors using `docker logs <container_id>`. Ensure all services (Nest.js backend, Angular frontend, PostgreSQL) are functioning correctly.
- **User Management**: Admins can manage project users via the system dashboard or command-line tools, as configured by the project requirements.
- **Backup and Recovery**: Regularly backup the PostgreSQL data. Verify that the Docker volume (`pgdata`) is secure and recoverable.

### 2. Deployment and Updates
- **Starting the Project for Admin Tasks**:
  - Navigate to the `backend` folder and run: `npm run start:dev`.
  - In the `frontend` folder, run: `ng serve`.
- **System Updates**: Ensure that Docker, Node.js, Angular CLI, and Nest CLI are regularly updated.

### 3. Troubleshooting
- **Error Checking**: Review service logs frequently.
- **Environment Variables**: Ensure that all environment configurations (in Docker, `.env` files, etc.) are properly set for production.

---

## عربي

### 1. مراقبة وصيانة المشروع
- **إدارة حاويات Docker**: استخدم الأمر `docker ps` لمراقبة الحاويات العاملة.
- **فحص السجلات**: تحقق من السجلات باستخدام الأمر `docker logs <container_id>` للتأكد من عدم وجود أخطاء وأن جميع الخدمات (خلفية Nest.js، الواجهة الأمامية Angular، PostgreSQL) تعمل بشكل صحيح.
- **إدارة المستخدمين**: يمكن للمدير إدارة مستخدمي المشروع عبر لوحة التحكم أو عبر أدوات سطر الأوامر كما هو محدد في متطلبات المشروع.
- **النسخ الاحتياطي والاستعادة**: قم بعمل نسخ احتياطية منتظمة لبيانات PostgreSQL. تأكد من أن مجلد الـ Docker المختص (مثل `pgdata`) مؤمن وقابل للاستعادة.

### 2. النشر والتحديثات
- **تشغيل المشروع لمهام الأدمين**:
  - انتقل إلى مجلد `backend` وتشغيل: `npm run start:dev`.
  - في مجلد `frontend`، شغل الأمر: `ng serve`.
- **تحديث النظام**: تأكد من تحديث Docker و Node.js و Angular CLI و Nest CLI بانتظام.

### 3. استكشاف الأخطاء وإصلاحها
- **فحص الأخطاء**: راجع سجلات الخدمات بشكل دوري.
- **متغيرات البيئة**: تأكد من إعداد كافة ملفات التكوين البيئية (مثل ملفات Docker و .env) بشكل صحيح لبيئة الإنتاج.

---

## Türkçe

### 1. Proje İzleme ve Bakım
- **Docker Konteyner Yönetimi**: Çalışan konteynerleri izlemek için `docker ps` komutunu kullanın.
- **Günlük Kayıtların Kontrolü**: `docker logs <container_id>` komutuyla hata kontrolü yapın ve tüm servislerin (Nest.js arka uç, Angular ön yüz, PostgreSQL) doğru çalıştığından emin olun.
- **Kullanıcı Yönetimi**: Yöneticiler, proje kullanıcılarını sistem panosu veya komut satırı araçları aracılığıyla, projenin gereksinimlerine göre yönetebilirler.
- **Yedekleme ve Kurtarma**: PostgreSQL verilerini düzenli olarak yedekleyin. Docker hacminin (`pgdata`) güvenli ve geri getirilebilir olduğundan emin olun.

### 2. Dağıtım ve Güncellemeler
- **Yönetici Görevleri için Projeyi Başlatma**:
  - `backend` klasörüne gidin ve `npm run start:dev` komutunu çalıştırın.
  - `frontend` klasöründe `ng serve` komutunu çalıştırın.
- **Sistem Güncellemeleri**: Docker, Node.js, Angular CLI ve Nest CLI'nın düzenli olarak güncellendiğinden emin olun.

### 3. Sorun Giderme
- **Hata Kontrolü**: Servis günlüklerini düzenli aralıklarla kontrol edin.
- **Ortam Değişkenleri**: Tüm ortam yapılandırmalarının (Docker, .env dosyaları vb.) üretim ortamı için doğru şekilde ayarlandığından emin olun.
