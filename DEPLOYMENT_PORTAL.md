# Panduan Integrasi & Deployment Clipan Portal Dashboard

Dokumen ini menjelaskan arsitektur dan langkah deployment **Clipan Portal Dashboard** — satu pintu gerbang terpusat (*Single Pane of Glass*) untuk mengakses seluruh aplikasi, tools monitoring, dan sistem keamanan di lingkungan PT Clipan Finance Indonesia Tbk.

---

## 1. Fitur Utama Portal Dashboard

1. **Desain Modern & Responsif**:
   * Meniru 100% konsep desain referensi (*MyPortal*): Sidebar navigasi, Hero Banner pemandangan senja pegunungan (*Twilight Mountains*), tab kategori, dan quick stats di panel kanan.
   * Dark Mode (default) & Light Mode toggle.
2. **Koleksi 40+ Aplikasi Bawaan (Pre-configured)**:
   * **🛡️ Security (SOC)**: Sentinel SOC Dashboard (Next.js 16 + Laravel 11), FortiManager, FortiGate ISFW Analytics, Data Center FGDC, IPSec Palo Alto, IPSec Branch, NetSec Hub, Enterprise Security Portal, dll.
   * **🌐 Network (NOC)**: NMS, LibreNMS Intelligence Portal, Network Weathermap Hub, Dashboard NOC, Room NOC Wall, LibreNMS Port, Switch & VLAN Manager, Oxidized Configs, Ruckus Wi-Fi, dll.
   * **📊 Monitoring & Telemetry**: Zabbix Enterprise Monitoring, Grafana Central Dashboards, Grafana AP, Database Performance Monitor, Compute Resource Tracker, Netflow, Ping Plotter, Route Tracert, Temperature & Power, Live Syslog Stream, dll.
   * **💼 Operations & ITOM**: Incident Response Center, IT Helpdesk & Tiket, Clipan ERP, Shift Logbook, RCA Archive, PushConfig Automation, WhatsApp Alert Gateway, Kitab SOP Runbooks, NetAsset Inventory, dll.
3. **Pencarian Cepat (Instant Search & Shortcut Ctrl + K)**:
   * Tekan tombol `Ctrl + K` di keyboard untuk langsung memfilter nama aplikasi, deskripsi, atau kategori secara instan.
4. **Favorites & Recent Activity**:
   * Klik icon Bintang di tiap kartu untuk mem-pin ke *Favorites*.
   * Setiap kali aplikasi dibuka, sistem otomatis mencatat riwayat ke panel *Recent Activity*.
5. **Add New App (Dinamis)**:
   * Terdapat kartu `+ Add New App` untuk mendaftarkan URL atau proyek baru kapan saja langsung dari browser (tersimpan di `localStorage`).
6. **Grid View & List View**:
   * Pilihan tampilan kotak kartu modern atau tabel ringkas sesuai preferensi analis.
7. **Portal Security, Login Animated Screen & Brute-Force Defense**:
   * **Animated Cyber SSO Screen**: Dilengkapi efek ambient orbs dinamis, scanner grid, scanline CRT, glowing logo hexagon berputar, dan cursor-following card spotlight.
   * **Manajemen Sesi Otomatis**: Sesi terenkripsi & tersinkronisasi (12 jam standar, 7 hari jika *Remember Me* aktif) dengan pemantauan otomatis setiap 30 detik.
   * **Anti Brute-Force Rate Limiting**: Proteksi akun maksimal 5 kali percobaan gagal dengan peringatan dinamis dan auto-lockout 60 detik disertai live countdown timer.
   * **Profil Dinamis & Logout**: Terintegrasi ke header dashboard dengan status role dan opsi Sign Out / Ganti Akun.

---

## 2. Cara Deployment ke Server (`soc.clipan.co.id`)

### Pilihan A: Sajikan Langsung Melalui Apache (Paling Cepat & Ringan - Disarankan)

Karena portal ini dibangun dengan React + Vite, seluruh aplikasi dikompilasi menjadi file statis super cepat (`HTML/CSS/JS`) di folder `dist/`.

#### Langkah 1: Build Proyek di Komputer Lokal
Di folder `clipan-portal-dashboard`, jalankan:
```bash
npm run build
```
*(Folder `dist/` sudah terbuat dan siap digunakan)*.

#### Langkah 2: Salin Folder `dist/` ke Server
Salin isi folder `dist/` ke direktori Apache server Anda, misalnya di `/var/www/html/portal` atau langsung sebagai landing page utama di `/var/www/html`:

```bash
# Contoh upload via SCP / Rsync ke server:
scp -r dist/* root@10.100.108.250:/var/www/html/portal/
```

#### Langkah 3: Konfigurasi Apache di Server (`soc-dashboard-proxy.conf`)
Buka konfigurasi Apache di server:
```bash
nano /etc/httpd/conf.d/soc-dashboard-proxy.conf
```

Pastikan rute root (`/`) atau `/portal/` mengarah ke portal ini, sementara semua folder project lain tetap dilayani normal:

```apache
<VirtualHost *:80>
    ServerName soc.clipan.co.id
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    # =========================================================================
    # 1. SOC DASHBOARD SERVICE DOCKER
    # =========================================================================
    ProxyPass /api/ http://127.0.0.1:8000/api/
    ProxyPassReverse /api/ http://127.0.0.1:8000/api/

    ProxyPass /storage/ http://127.0.0.1:8000/storage/
    ProxyPassReverse /storage/ http://127.0.0.1:8000/storage/

    ProxyPass /app/soc_dashboard_reverb_key ws://127.0.0.1:8080/app/soc_dashboard_reverb_key
    ProxyPassReverse /app/soc_dashboard_reverb_key ws://127.0.0.1:8080/app/soc_dashboard_reverb_key

    ProxyPass /_next/ http://127.0.0.1:3000/_next/
    ProxyPassReverse /_next/ http://127.0.0.1:3000/_next/

    ProxyPass /login http://127.0.0.1:3000/login
    ProxyPassReverse /login http://127.0.0.1:3000/login

    ProxyPass /firewall http://127.0.0.1:3000/firewall
    ProxyPassReverse /firewall http://127.0.0.1:3000/firewall

    ProxyPass /edr http://127.0.0.1:3000/edr
    ProxyPassReverse /edr http://127.0.0.1:3000/edr

    ProxyPass /pam http://127.0.0.1:3000/pam
    ProxyPassReverse /pam http://127.0.0.1:3000/pam

    ProxyPass /db http://127.0.0.1:3000/db
    ProxyPassReverse /db http://127.0.0.1:3000/db

    ProxyPass /health http://127.0.0.1:3000/health
    ProxyPassReverse /health http://127.0.0.1:3000/health

    ProxyPass /overview http://127.0.0.1:3000/overview
    ProxyPassReverse /overview http://127.0.0.1:3000/overview

    # =========================================================================
    # 2. LANDING PAGE PORTAL DI ROOT (https://soc.clipan.co.id/)
    # Jika diletakkan di /var/www/html/portal, arahkan root ke /portal:
    # =========================================================================
    DirectoryIndex index.html index.php

    # Jika ditaruh di folder /portal:
    Alias /portal /var/www/html/portal
    <Directory /var/www/html/portal>
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    # Redirect root '/' langsung ke portal jika diinginkan:
    # RedirectMatch 302 ^/?$ https://soc.clipan.co.id/portal/
</VirtualHost>
```

Lalu reload Apache:
```bash
apachectl configtest
systemctl reload httpd
```

---

### Pilihan B: Jalankan Menggunakan Docker Kontainer

Di folder `clipan-portal-dashboard` sudah disediakan `Dockerfile` siap pakai.

---

## 4. Cara Update Cepat di Server (`dc-uat-dwilab-app-001`)

Jika ada update terbaru dari GitHub repository (`https://github.com/Wahayu26/clipan-portal-dashboard.git`), jalankan langkah berikut di terminal server:

```bash
cd /var/www/html/portal

# 1. Pastikan git safe directory terdaftar
git config --global --add safe.directory /var/www/html/portal

# 2. Reset dan pull kode terbaru dari GitHub
git reset --hard origin/main
git pull origin main

# 3. Rebuild dan restart kontainer portal Docker
docker compose up -d --build

# 4. Verifikasi kontainer sudah berjalan normal
docker ps --filter "name=clipan-portal"
```
