# Iter Catholicum ✝️

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![romcal](https://img.shields.io/badge/romcal-3B82F6?style=for-the-badge&logo=github&logoColor=white)

**A modern, high-performance web application designed for the Catholic life, providing a fluid experience for navigating the liturgical calendar and reading the Holy Scriptures in Latin and Spanish.**

> ⚠️ **IMPORTANT LEGAL DISCLAIMER**: This application uses **ONLY PUBLIC DOMAIN** biblical texts. No copyrighted modern versions are distributed or hosted within this software. All liturgical logic is powered by open-source engines and historical data.

---

## 📖 Overview

**Iter Catholicum** is an all-in-one liturgical companion. It combines the technical precision of the `romcal` liturgical engine with a beautiful, antique-inspired interface to offer users a bridge between tradition and modern technology. Whether you are checking the rank of a festivity or reading the Vulgate for prayer, this tool is designed to be fast, reliable, and spiritually focused.

### Key Features

- **📅 Dynamic Liturgical Calendar**: Complete coverage of liturgical days, feast ranks, and liturgical colors for any year.
- **✨ Daily Liturgical Card**: Instant view of today's liturgical context directly on the home page.
- **📖 Public Domain Bible Reader**: Access to historical, copyright-free translations in both Spanish and Latin (Vulgata & Torres Amat).
- **🔠 Elegant Typography**: Traditional drop caps and refined font sets for an immersive reading experience.
- **🔍 Smart Search**: Instant, accent-insensitive search for festivities and biblical passages.
- **🌍 Bilingual Interface**: Effortless toggling between Latin (_lingua ecclesiastica_) and Spanish.
- **💎 Premium Design**: A curated "clerical" aesthetic with dark red accents, ivory paper textures, and elegant typography.

---

## 🚨 Legal Notice & Copyright Disclaimer

### What This Project Contains

This project is committed to preserving and sharing the Catholic heritage through technology while respecting intellectual property:

- ✅ **Source Code**: Fully original React implementation.
- ✅ **Historical Data**: Liturgical computations based on the General Roman Calendar.
- ✅ **Public Domain Texts**: Only bibles with expired copyright or public domain status.

### Explicitly Excluded Content

- ❌ **No Copyrighted Bibles**: We do **not** use or host versions such as the _Biblia de la Conferencia Episcopal Española (CEE)_, _Nueva Biblia de las Américas_, _NIV_, or any other version with active third-party rights.
- ❌ **No Pirated Content**: All data used is either generated algorithmically or sourced from community-verified public domain repositories.

### User Responsibility

The application is provided "as-is" for personal, educational, and devotional use. Users are encouraged to verify the liturgical accuracy and source status within their own jurisdictional context.

---

## 📂 Project Structure

```text
.
├── src/
│   ├── components/        # UI Components (Headless & Styled)
│   │   ├── ui/            # Radix UI primitives
│   │   ├── Calendar/      # Liturgical calendar logic and views
│   │   └── Bible/         # Bible reader and selector logic
│   ├── hooks/             # Custom React hooks (useCalendar, etc.)
│   ├── lib/               # Core utility libraries and Romcal logic
│   ├── constants/         # UI strings and configuration
│   └── types/             # TypeScript definitions
├── public/                # Static assets and fonts
└── bible_metadata.json    # Structural metadata for PB Bibles
```

---

## 🚀 Installation & Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

### 4. Continuous Deployment

The project is configured with **GitHub Actions** to automatically deploy to GitHub Pages on every push to `main`.

---

## 📚 Biblical Sources & Licensing

To ensure full transparency and legal compliance, the following versions are used as the backbone of the reader. These versions are recognized globally as **Public Domain**.

| Version                | Language | Year | Source / Reference                                                                                                               |
| ---------------------- | -------- | ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Vulgata Clementina** | Latin    | 1592 | [Wikisource](https://la.wikisource.org/wiki/Vulgata_Clementina/) ([Wikipedia](https://es.wikipedia.org/wiki/Vulgata_clementina)) |
| **Biblia Torres Amat** | Spanish  | 1823 | [Wikipedia](https://es.wikipedia.org/wiki/Biblia_Torres_Amat) ([Credo Bible Study](https://www.credobiblestudy.com/es/read))     |

### Software License

The **Iter Catholicum** software (code, styles, and logic) is released under the **[MIT License](LICENSE)**.

---

## Author

Developed by _Daniel Losada_

[![GitHub](https://img.shields.io/badge/GitHub-danloi2-181717?style=for-the-badge&logo=github)](https://github.com/danloi2)
[![Researcher EHU](https://img.shields.io/badge/Researcher-EHU-blue?style=for-the-badge&logo=researchgate)](https://github.com/danloi2)

---

## 🛠️ Technical Credits

- **[romcal](https://github.com/romcal/romcal)**: The core liturgical engine powering the calendar logic. We use the version `3.0.0` (dev branch) to ensure modern liturgical precision.

---

## ⚖️ Final Legal Statement

**This software is a technological tool for liturgical navigation. The author:**

- Does NOT provide access to copyrighted content.
- Does NOT assume responsibility for external uses of the extracted data.
- Does NOT guarantee the absolute accuracy of liturgical calculations (though we strive for it using `romcal`).

_Ad maiorem Dei gloriam._
