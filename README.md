# SiklusFit

Tagline: "Pahami siklusmu, makan yang tepat, rasakan bedanya."

## Menjalankan lokal

```bash
npm install
npm start
```

Pilih perangkat Expo Go, Android emulator, iOS simulator, atau web dari terminal Expo.

## Test

```bash
npm test
```

## Build Android untuk Play Store

```bash
npm install -g eas-cli
eas login
eas build -p android --profile production
```

Output production memakai Android App Bundle (`.aab`) sesuai kebutuhan Play Store. MVP ini tidak memakai backend eksternal; scanner foto memakai mock AI call sampai API key Gemini Vision/Claude disambungkan.

## Acceptance Criteria

- Setelah onboarding, user melihat dashboard dengan fase siklus dari tanggal menstruasi terakhir.
- User dapat log gejala hari ini dan melihat ringkasan pada grafik history.
- Food scanner menerima foto dari galeri dan menampilkan estimasi kalori, makro, dan komentar fase.
- Meal planner menghasilkan 3 makan utama plus snack sesuai fase dan goal.
- Kalender menampilkan prediksi menstruasi, ovulasi, dan fertile window dengan label warna.
- Data profil, log siklus, food entry, dan meal plan tetap ada setelah app dijalankan ulang.
- Empty, loading, dan error state tersedia pada layar utama.
