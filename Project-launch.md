# How to Run the Project / كيفية تشغيل المشروع / Projenin Çalıştırılması

This document provides step-by-step instructions on how to set up and run the project. Instructions are provided in English, Arabic, and Turkish.

---

## English

### Requirements
- Node.js (v14 or higher)
- Docker (for containerized services)
- PostgreSQL 17 (either installed locally or via Docker)
- Angular CLI (for the frontend)
  ```bash
  npm install -g @angular/cli
  ```
- Nest CLI (for the backend)
  ```bash
  npm install -g @nestjs/cli
  ```

### Setup and Installation
1. **Install project dependencies**
   - At the project root:
     ```bash
     npm install
     ```
   - In the backend folder:
     ```bash
     cd backend
     npm install
     ```
   - In the frontend folder:
     ```bash
     cd frontend
     npm install
     ```

2. **Set up Docker and PostgreSQL**
   - Navigate to the `backend` folder (which contains the `docker-compose.yml` file) and run:
     ```bash
     docker compose up -d
     ```
   - Ensure that your PostgreSQL data is stored in `backend/pgdata` as configured.

3. **Launch the Services**
   - For the backend (Nest.js):
     ```bash
     cd backend
     npm run start:dev
     ```
   - For the frontend (Angular):
     ```bash
     cd frontend
     ng serve
     ```

4. **Additional Tasks for the Administrator**
   - Monitor Docker containers using `docker ps`.
   - Check logs using `docker logs <container_id>`.
   - Manage backups for PostgreSQL data regularly.

---

## عربي

### المتطلبات
- Node.js (الإصدار 14 أو أحدث)
- Docker (لتشغيل الخدمات في حاويات)
- PostgreSQL 17 (يمكن استخدام التثبيت المحلي أو Docker)
- Angular CLI (للواجهة الأمامية)
  ```bash
  npm install -g @angular/cli
  ```
- Nest CLI (لخلفية التطبيق)
  ```bash
  npm install -g @nestjs/cli
  ```

### خطوات الإعداد والتشغيل
1. **تثبيت الاعتمادات**
   - في جذر المشروع:
     ```bash
     npm install
     ```
   - في مجلد الخلفة `backend`:
     ```bash
     cd backend
     npm install
     ```
   - في مجلد الواجهة الأمامية `frontend`:
     ```bash
     cd frontend
     npm install
     ```

2. **إعداد Docker و PostgreSQL**
   - انتقل إلى مجلد `backend` الذي يحتوي على ملف `docker-compose.yml` وتشغيل الأمر:
     ```bash
     docker compose up -d
     ```
   - تأكد من أن بيانات PostgreSQL محفوظة في المجلد `backend/pgdata` كما هو محدد.

3. **تشغيل الخدمات**
   - لتشغيل الخادم الخلفي (Nest.js):
     ```bash
     cd backend
     npm run start:dev
     ```
   - لتشغيل الواجهة الأمامية (Angular):
     ```bash
     cd frontend
     ng serve
     ```

4. **مهام إضافية للمسؤول**
   - مراقبة حاويات Docker باستخدام الأمر `docker ps`.
   - فحص السجلات باستخدام الأمر `docker logs <container_id>`.
   - إجراء نسخ احتياطية لبيانات PostgreSQL بشكل منتظم.

---

## Türkçe

### Gereksinimler
- Node.js (v14 veya üzeri)
- Docker (konteyner servisleri için)
- PostgreSQL 17 (yerel olarak kurulabilir ya da Docker ile kullanılabilir)
- Angular CLI (ön yüz için)
  ```bash
  npm install -g @angular/cli
  ```
- Nest CLI (arka uç için)
  ```bash
  npm install -g @nestjs/cli
  ```

### Kurulum ve Yükleme Adımları
1. **Proje bağımlılıklarını yükleyin**
   - Proje kök dizininde:
     ```bash
     npm install
     ```
   - Backend klasöründe:
     ```bash
     cd backend
     npm install
     ```
   - Frontend klasöründe:
     ```bash
     cd frontend
     npm install
     ```

2. **Docker ve PostgreSQL Kurulumu**
   - `docker-compose.yml` dosyasının bulunduğu `backend` klasörüne gidin ve şu komutu çalıştırın:
     ```bash
     docker compose up -d
     ```
   - PostgreSQL verilerinizin `backend/pgdata` klasöründe saklandığından emin olun.

3. **Servisleri Başlatın**
   - Arka uç (Nest.js) için:
     ```bash
     cd backend
     npm run start:dev
     ```
   - Ön yüz (Angular) için:
     ```bash
     cd frontend
     ng serve
     ```

4. **Yönetici için Ek Görevler**
   - Docker konteynerlerini izlemek için `docker ps` komutunu kullanın.
   - Günlükleri kontrol etmek için `docker logs <container_id>` komutunu kullanın.
   - PostgreSQL verilerinin düzenli olarak yedeğini alın.
