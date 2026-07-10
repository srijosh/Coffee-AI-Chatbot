# Coffee Ghar ☕ – AI Chatbot with Product Recommendation, RAG, and e-Commerce Integration

Coffee Ghar is an AI-powered customer service and recommendation chatbot built for a coffee shop. It combines an agent-based architecture(powered by **OpenAI/GPT-OSS-120b via Groq**), Retrieval-Augmented Generation (RAG), and Apriori-based product recommendations to enable seamless ordering, information retrieval, and real-time assistance. The backend connects dynamically to a React + TypeScript e-commerce interface, complete with a full administrative suite, automated inventory tracking, and eSewa sandbox payment integration.

Live Demo:

```text
https://coffee-frontend-7tgb.onrender.com
```

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Dataset](#-dataset)
- [Features](#-features)
- [Database & Storage Architecture](#️-database--storage-architecture)
- [Admin Dashboard Capabilities](#-admin-dashboard-capabilities)
- [Installation](#️-installation)
- [Usage](#-usage)
- [Tools and Technologies](#️-tools-and-technologies)

---

## 🚀 Introduction

This project features an intelligent coffee shop chatbot system that understands user intents (like greetings, product orders, or information queries), recommends complementary items using market basket analysis, and fetches factual answers using RAG with openai/gpt-oss-120b. It supports both backend FastAPI endpoints and a React + TypeScript-based frontend which offers a full-featured e-commerce web app including login/logout feature, an interactive product menu, a dedicated live chatbot console that dynamically updates your cart, and a transparent order tracker.
The backend coordinates with MongoDB to manage user accounts, log order histories, and handle real-time product updates. Cloudinary serves product media efficiently, while Pinecone stores knowledge base embeddings to power the RAG pipeline.
As an additional management layer, the platform also features a secure administrative dashboard. This panel lets operators monitor analytics (gross revenue, sales volume, order counters), shift order tracking states (`Pending` / `Delivered`), restock units dynamically, and manage system user access profiles.

---

## 📊 Dataset

- **Source**: [Coffee Shop Sample Dataset – Kaggle](https://www.kaggle.com/datasets/ylchang/coffee-shop-sample-data-1113)
- **Files Used:**: Saved as `news_articles_dataset.csv` with columns:
  - `201904 sales receipts.csv`: Contains transactional data.
  - `product.csv`: Contains product names and categories.
- **Use**: Used for mining frequent itemsets and generating product recommendations via Apriori and association rule mining.

---

## ✨ Features

### 🤖 Multi-Agent Architecture

- **Guard Agent**: Filters out irrelevant, unsafe, or out-of-scope customer queries.
- **Classification Agent**: Evaluates user messaging intents to route tasks dynamically.
- **Order Taking Agent**: Extracts menu items and quantities, then dynamically adds them to the frontend cart.
- **Recommendation Agent**: Suggests frequently bought-together items using market basket analysis.
- **Details Agent (RAG)**: Answers FAQs using dense vector search (MiniLM) and openai/gpt-oss-120b.

### 🧮 Data Mining & Recommendation Mechanics

- **Custom Apriori Engine**: Tailored frequent itemset mining and association rule generation.

### 🛒 E-Commerce & User Experience

- **React Frontend**: Modern web dashboard with an interactive menu, a live chat interface, and a responsive layout.
- **Profile System**: Secure user registration, authentication login handlers, and complete purchase history tracking.
- **Dynamic Cart Syncing**: Chatbot dependencies update active frontend context states directly without manual clicking.

### 💳 Logistics & Payment Security

- **Dynamic Inventory Control**: Tracks individual stock volumes and triggers `Out of Stock` alerts when limits are hit.
- **Automated Stock Decrement**: Successful checkout structures instantly scale down product counts inside MongoDB.
- **eSewa Sandbox Integration**: Secure end-to-end payment gateway simulation.

---

## 🗄️ Database & Storage Architecture

- **MongoDB**: Central document-store managing all transactional data, active user accounts, order logs and live product schemas.
- **Pinecone**: Low-latency vector database tracking `all-MiniLM-L6-v2` contextual knowledge base matrix embeddings used for RAG operations.
- **Cloudinary**: Cloud image infrastructure managing and optimization-serving menu graphics across the product ecosystem.

---

## 📊 Admin Dashboard Capabilities

The secure administration panel gives operators complete granular system overview management:

- **Overall Stats Engine**: Real-time analytical tracking displaying Total Orders compiled, gross Revenue generated, and aggregate Items Sold.
- **Order Fulfilment Pipeline**: Master order management dashboard with immediate state toggle tools (`Pending` ↔ `Delivered`).
- **Product Inventory Engine**: Live CRUD capability handling menu listings, updating metadata, and re-stocking units.
- **User Accounts Controller**: Data auditing panel with tools to manage profile status and remove users securely.

---

## ⚙️ Installation

```
   git clone https://github.com/srijosh/Coffee-AI-Chatbot.git
   cd Coffee-AI-Chatbot
```

- **Backend**

```
   cd Backend
   pip install -r requirements.txt
   uvicorn main:app --reload
```

- **Frontend**

```
   cd coffee-shop-web
   npm install
   npm run dev
```

- Update the .env file with the correct backend URL and environment variables.

---

## 💡 Usage

- Visit the frontend URL (typically http://localhost:5173)

- Log in or create a user account

- Use the chatbot to:

- Ask questions (e.g., "What’s your shop about?")

- Place orders (e.g., "I want 2 cappuccinos")

- Get recommendations (e.g., "Suggest something with cappuccino")

- Checkout using eSewa sandbox

---

## 🛠️ Tools and Technologies

- 🧠 openai/gpt-oss-120b (via Groq): Factual answering and response generation

- 📦 FastAPI: Backend framework

- 🛒 React + TypeScript: Frontend framework for e-commerce interface

- 📘 Pinecone + MiniLM: RAG-based knowledge retrieval

- 🧮 Custom Apriori: Frequent itemset mining and association rule generation

- 💳 eSewa Sandbox API: For testing payment flows

- 📊 Pandas / Matplotlib: For dataset processing and insights
