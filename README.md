# Coffee Ghar ☕ – AI Chatbot with Product Recommendation, RAG, and e-Commerce Integration

Coffee Ghar is an AI-powered customer service and recommendation chatbot built for a coffee shop. It combines an agent-based architecture, LLaMA 3.3–70B, Retrieval-Augmented Generation (RAG), and Apriori-based product recommendations to enable seamless ordering, information retrieval, and real-time assistance via a frontend e-commerce interface.

## Table of Contents

- [Introduction](#introduction)
- [Dataset](#dataset)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tools and Technologies](#tools-and-technologies)

## Introduction

This project features an intelligent coffee shop chatbot system that understands user intents (like greetings, product orders, or information queries), recommends complementary items using market basket analysis, and fetches factual answers using RAG with LLaMA 3.3–70B. It supports both backend FastAPI endpoints and a React + TypeScript-based frontend that includes user login, order history, and eSewa sandbox payment.

## Dataset

- **Source**: [Coffee Shop Sample Dataset – Kaggle](https://www.kaggle.com/datasets/ylchang/coffee-shop-sample-data-1113)
- **Files Used:**: Saved as `news_articles_dataset.csv` with columns:
  - `201904 sales receipts.csv`: Contains transactional data.
  - `product.csv`: Contains product names and categories.
- **Use**: Used for mining frequent itemsets and generating product recommendations via Apriori and association rule mining.

## Features

- Modular agent-based architecture:

- Guard Agent: Filters irrelevant queries.

- Classification Agent: Routes intent to appropriate handlers.

- Order Taking Agent: Extracts items and quantities from orders.

- Recommendation Agent: Suggests frequently bought-together items using Apriori.

- Details Agent (RAG): Answers FAQs using vector search (MiniLM) + LLaMA 3.3–70B.

- Custom Apriori and association rule mining implementation.

- React-based e-commerce frontend with cart and live chat.

- Login system and order history tracking.

- eSewa sandbox integration for payments.

## Installation

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

## Usage

- Visit the frontend URL (typically http://localhost:5173)

- Log in or create a user account

- Use the chatbot to:

- Ask questions (e.g., "What’s your shop about?")

- Place orders (e.g., "I want 2 cappuccinos")

- Get recommendations (e.g., "Suggest something with cappuccino")

- Checkout using eSewa sandbox

## Tools and Technologies

- 🧠 LLaMA 3.3–70B (via Groq): Factual answering and response generation

- 📦 FastAPI: Backend framework

- 🛒 React + TypeScript: Frontend framework for e-commerce interface

- 📘 Pinecone + MiniLM: RAG-based knowledge retrieval

- 🧮 Custom Apriori: Frequent itemset mining and association rule generation

- 💳 eSewa Sandbox API: For testing payment flows

- 📊 Pandas / Matplotlib: For dataset processing and insights
