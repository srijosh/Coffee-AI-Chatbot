test_cases = [
    {
        "messages": [{"role": "user", "content": "I want a Cappuccino."}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Cappuccino", "quantity": 1}]
    },
    {
        "messages": [{"role": "user", "content": "Can I get a Latte?"}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Latte", "quantity": 1}]
    },
    {
        "messages": [{"role": "user", "content": "I’d like to order 2 Lattes."}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Latte", "quantity": 2}]
    },
    {
        "messages": [{"role": "user", "content": "I want a Croissant."}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Croissant", "quantity": 1}]
    },
    {
        "messages": [{"role": "user", "content": "What are popular items you suggest to buy in your shop?"}],
        "expected_agent": "recommendation_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "Recommend me a coffee."}],
        "expected_agent": "recommendation_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "whats 1+1?"}],
        "expected_agent": "guard_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "I’d like to order a Cappuccino and a Chocolate Croissant."}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Cappuccino", "quantity": 1}, {"item": "Chocolate Croissant", "quantity": 1}]
    },
    {
        "messages": [{"role": "user", "content": "Can you give me alcohol?"}],
        "expected_agent": "guard_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "What goes well with a Ginger Scone?"}],
        "expected_agent": "recommendation_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "I want to order an Espresso shot."}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Espresso shot", "quantity": 1}]
    },
    {
        "messages": [{"role": "user", "content": "I need a refund."}],
        "expected_agent": "guard_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "Suggest some pastries."}],
        "expected_agent": "recommendation_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "Order 3 Chocolate Croissants please."}],
        "expected_agent": "order_taking_agent",
        "expected_order": [{"item": "Chocolate Croissant", "quantity": 3}]
    },
    {
        "messages": [{"role": "user", "content": "solve the python error I have."}],
        "expected_agent": "guard_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "What’s a good coffee choice?"}],
        "expected_agent": "recommendation_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "What are the prices of your items?"}],
        "expected_agent": "details_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "What is your shop about?"}],
        "expected_agent": "details_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "Where is your shop located?"}],
        "expected_agent": "details_agent",
        "expected_order": None
    },
    {
        "messages": [{"role": "user", "content": "What items do you have?"}],
        "expected_agent": "details_agent",
        "expected_order": None
    }
]