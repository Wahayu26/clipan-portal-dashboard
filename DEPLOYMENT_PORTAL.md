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
        Options FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    # =========================================================================
    # 1. LEGACY REDIRECT: Lempar semua URL lama ke DASHBOARD SOC BARU (/overview)
    # Tidak lagi merujuk ke soc-dashboard-finale-laravel!
    # =========================================================================
    RedirectMatch 302 ^/soc-dashboard-finale.*$ https://soc.clipan.co.id/overview
    RedirectMatch 302 ^/soc-dashboard-finale-laravel.*$ https://soc.clipan.co.id/overview

    # =========================================================================
    # 2. BYPASS PROXY UNTUK TOOL NATIVE LOKAL (/var/www/html/...)
    # =========================================================================
    ProxyPass /fmg !
    ProxyPass /palo !
    ProxyPass /incident !
    ProxyPass /grafana !
    ProxyPass /zabbix !
    ProxyPass /nms !
    ProxyPass /weather !
    ProxyPass /rancid !
    ProxyPass /oxidized !
    ProxyPass /cacti !
    ProxyPass /smokeping !
    ProxyPass /syslog !

    # =========================================================================
    # 3. BACKEND API & WEBSOCKET PORTAL (Port 8091)
    # =========================================================================
    ProxyPass /api/portal/ http://127.0.0.1:8091/api/portal/
    ProxyPassReverse /api/portal/ http://127.0.0.1:8091/api/portal/

    # =========================================================================
    # 4. SENTINEL SOC COMMAND CENTER NEW v2.0 - BACKEND API & WEBSOCKETS
    # =========================================================================
    ProxyPass /api/ http://127.0.0.1:8000/api/
    ProxyPassReverse /api/ http://127.0.0.1:8000/api/

    ProxyPass /storage/ http://127.0.0.1:8000/storage/
    ProxyPassReverse /storage/ http://127.0.0.1:8000/storage/

    ProxyPass /app/soc_dashboard_reverb_key ws://127.0.0.1:8080/app/soc_dashboard_reverb_key
    ProxyPassReverse /app/soc_dashboard_reverb_key ws://127.0.0.1:8080/app/soc_dashboard_reverb_key

    # =========================================================================
    DirectoryIndex index.html index.php traffic.php switch.php config.php branch.php dashboard-noc.php dashboard.php home.php default.php index.htm login.php

    <Directory /var/www/html>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    # =========================================================================
    # 1. LARAVEL APPS ENTRYPOINT REDIRECT
    # =========================================================================
    RedirectMatch 302 ^/security/?$ https://soc.clipan.co.id/security/public/
    RedirectMatch 302 ^/incident/?$ https://soc.clipan.co.id/incident/public/

    # =========================================================================
    # 2. BYPASS PROXY UNTUK TOOL NATIVE LOKAL (/var/www/html/...)
    # Apache melayani langsung folder-folder ini tanpa diteruskan ke Docker
    # =========================================================================
    ProxyPass /vlan !
    ProxyPass /wa-alert !
    ProxyPass /traffic-fgdc !
    ProxyPass /traffic-isfw !
    ProxyPass /traffic-branch !
    ProxyPass /switch !
    ProxyPass /pushconfig !
    ProxyPass /dashboard-noc !
    ProxyPass /room-noc !
    ProxyPass /noc-office !
    ProxyPass /interface !
    ProxyPass /interface-10mb !
    ProxyPass /fmg !
    ProxyPass /palo !
    ProxyPass /ipsec-palo !
    ProxyPass /ipsec-branch !
    ProxyPass /incident !
    ProxyPass /security !
    ProxyPass /netsec-hub !
    ProxyPass /grafana !
    ProxyPass /grafana-ap !
    ProxyPass /monitor-db !
    ProxyPass /cpu-memory-librenms !
    ProxyPass /zabbix !
    ProxyPass /zabbix-server-dashboard !
    ProxyPass /nms !
    ProxyPass /librenms-intelligence-portal !
    ProxyPass /librenms-port !
    ProxyPass /weather !
    ProxyPass /weathermap-new !
    ProxyPass /rancid !
    ProxyPass /oxidized !
    ProxyPass /cacti !
    ProxyPass /smokeping !
    ProxyPass /syslog !
    ProxyPass /netflow !
    ProxyPass /ping-plotter !
    ProxyPass /tracert !
    ProxyPass /temperatur !
    ProxyPass /erp !
    ProxyPass /tiket !
    ProxyPass /logbook !
    ProxyPass /rca !
    ProxyPass /kitab !
    ProxyPass /netasset !
    ProxyPass /ruckus !

    # =========================================================================
    # 3. BACKEND API & WEBSOCKET PORTAL (Port 8091)
    # =========================================================================
    ProxyPass /api/portal/ http://127.0.0.1:8091/api/portal/
    ProxyPassReverse /api/portal/ http://127.0.0.1:8091/api/portal/

    # =========================================================================
    # 4. SENTINEL SOC COMMAND CENTER - BACKEND API & WEBSOCKETS (Port 8000 & 8080)
    # =========================================================================
    ProxyPass /api/ http://127.0.0.1:8000/api/
    ProxyPassReverse /api/ http://127.0.0.1:8000/api/

    ProxyPass /storage/ http://127.0.0.1:8000/storage/
    ProxyPassReverse /storage/ http://127.0.0.1:8000/storage/

    ProxyPass /app/soc_dashboard_reverb_key ws://127.0.0.1:8080/app/soc_dashboard_reverb_key
    ProxyPassReverse /app/soc_dashboard_reverb_key ws://127.0.0.1:8080/app/soc_dashboard_reverb_key

    # =========================================================================
    # 5. SENTINEL SOC COMMAND CENTER - FRONTEND (Next.js Port 3000)
    # Rute project soc-dashboard-finale langsung diarahkan ke Next.js
    # =========================================================================
    ProxyPass /_next/ http://127.0.0.1:3000/_next/
    ProxyPassReverse /_next/ http://127.0.0.1:3000/_next/

    # Tangkap redirect upstream Load Balancer ke /soc-dashboard-finale/login.php -> Buka Portal (Port 8090)
    ProxyPass /soc-dashboard-finale/login.php http://127.0.0.1:8090/
    ProxyPassReverse /soc-dashboard-finale/login.php http://127.0.0.1:8090/

    ProxyPass /soc-dashboard-finale/ http://127.0.0.1:3000/soc-dashboard-finale/
    ProxyPassReverse /soc-dashboard-finale/ http://127.0.0.1:3000/soc-dashboard-finale/

    ProxyPass /soc-dashboard-finale http://127.0.0.1:3000/soc-dashboard-finale
    ProxyPassReverse /soc-dashboard-finale http://127.0.0.1:3000/soc-dashboard-finale

    ProxyPass /overview http://127.0.0.1:3000/overview
    ProxyPassReverse /overview http://127.0.0.1:3000/overview

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

    # =========================================================================
    # 6. CLIPAN PORTAL DASHBOARD (Vite Port 8090)
    # Melayani portal di root domain / dan /portal/ serta static assets
    # =========================================================================
    ProxyPass /portal/ http://127.0.0.1:8090/
    ProxyPassReverse /portal/ http://127.0.0.1:8090/

    ProxyPass /assets/ http://127.0.0.1:8090/assets/
    ProxyPassReverse /assets/ http://127.0.0.1:8090/assets/

    ProxyPass /favicon.svg http://127.0.0.1:8090/favicon.svg
    ProxyPassReverse /favicon.svg http://127.0.0.1:8090/favicon.svg

    ProxyPass /login http://127.0.0.1:8090/
    ProxyPassReverse /login http://127.0.0.1:8090/

    # Fallback untuk root / jika tidak cocok dengan file lokal
    ProxyPass / http://127.0.0.1:8090/
    ProxyPassReverse / http://127.0.0.1:8090/
    ProxyPassReverse /portal/ http://127.0.0.1:8090/

    ProxyPass /portal http://127.0.0.1:8090/
    ProxyPassReverse /portal http://127.0.0.1:8090/

    ProxyPass /assets/ http://127.0.0.1:8090/assets/
    ProxyPassReverse /assets/ http://127.0.0.1:8090/assets/

    ProxyPass /favicon.svg http://127.0.0.1:8090/favicon.svg
    ProxyPassReverse /favicon.svg http://127.0.0.1:8090/favicon.svg

    # =========================================================================
    # 5. KHUSUS ROOT URL (/) SAJA -> PROXY KE PORTAL CONTAINER (Port 8090)
    # Menggunakan mod_rewrite agar HANYA / yang di-proxy, BUKAN subpath lain!
    # =========================================================================
    RewriteEngine On
    RewriteRule ^/?$ http://127.0.0.1:8090/ [P,L]

    # =========================================================================
    # SEMUA SUBPATH LAIN (/zabbix-server-dashboard/, /tiket/, /fmg/, dll.)
    # AKAN DILAYANI LANGSUNG DARI DISK /var/www/html/ OLEH APACHE SECARA NATIVE!
    # =========================================================================
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
