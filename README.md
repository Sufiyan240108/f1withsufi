# 🏎️ f1withsufi

![Project Banner](hero_image.png)

> **The Precision Engineering Terminal for Formula 1 Data.**
> A free, modular, post-session analytics platform designed for deep technical insights.

[![GitHub stars](https://img.shields.io/github/stars/sufiy/f1-sufi?style=for-the-badge)](https://github.com/sufiy/f1-sufi/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Powered by FastF1](https://img.shields.io/badge/Data-FastF1-blue?style=for-the-badge)](https://github.com/theOehrly/FastF1)

---

## 🏁 Vision

f1withsufi bridges the gap between casual fan apps and professional telemetry tools. Our mission is to provide **quantitative insights** into driver performance and team strategy without the noise, all within a sleek, high-performance interface inspired by the **Bloomberg Terminal**.

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| **Core UI** | React 18, Vite, Framer Motion |
| **Data Viz** | Chart.js, D3.js (SVG Tracks) |
| **Engine** | Python 3.11+, FastAPI |
| **Persistence** | PostgreSQL + Redis (Caching) |
| **Analytics** | FastF1, SQLAlchemy |
| **DevOps** | Docker, Vercel, Render |

---

## 📊 Key Features & Derived Metrics

Unlike standard dashboards, OpenF1 computes advanced performance indices:

- **📈 Stint Degradation Slopes:** Real-time calculation of tyre wear impact on pace.
- **🎯 Consistency Index:** Lap-to-lap variance analysis using standard deviation.
- **⚡ Undercut/Overcut Effectiveness:** Post-race evaluation of pit stop strategy success.
- **🗺️ Interactive Track Telemetry:** SVG-rendered track maps with synchronized driver telemetry traces.
- **🚥 Championship Progression:** Round-by-round point gaps visualized using official snapshots.

---

## projects/
```bash
f1-sufi/
├── backend/          # FastAPI & Analytics Engine
│   ├── analytics/    # Statistical model implementations
│   ├── connectors/   # API wrappers (FastF1, Jolpica)
│   └── normalizers/  # Data transformation layer
├── frontend/         # React SPA
│   ├── src/layout/   # Adaptive UI containers
│   └── src/pages/    # Interactive dashboards
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+ / Node.js 20+ / Docker

### Local Development

1. **Spin up Infrastructure:**
   ```bash
   docker-compose up -d
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   alembic upgrade head
   uvicorn main:app --reload
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install && npm run dev
   ```

---

## ⚖️ Compliance & Data
*This project strictly adheres to F1 data usage policies. It does NOT redistribute live timing feeds. All data is fetched post-session from community-driven APIs (FastF1/Jolpica) and all analytics are derived independently.*

---

## 🤝 Contributing
Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

Developed with ❤️ for the F1 Community.
