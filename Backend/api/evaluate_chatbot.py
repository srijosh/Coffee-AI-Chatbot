import json
import random
from agent_controller import AgentController
import matplotlib.pyplot as plt
from test_cases import test_cases

# Initialize AgentController
controller = AgentController()

def evaluate_chatbot():
    agent_correct = []
    order_accuracies = []
    satisfaction_scores = []

    for test_case in test_cases:
        input_data = {"input": {"messages": test_case["messages"]}}
        
        # Get response from AgentController
        response = controller.get_response(input_data)
        content = response["content"]
        actual_agent = response["memory"]["agent"] if "agent" in response["memory"] else None

        # Validate agent selection
        is_correct_agent = actual_agent == test_case["expected_agent"]
        agent_correct.append(1 if is_correct_agent else 0)

        # Order accuracy
        if actual_agent == "order_taking_agent" and test_case.get("expected_order") is not None:
            order = response["memory"]["order"] if "order" in response["memory"] else []
            expected_order = test_case["expected_order"]
            # Normalize quantity types for comparison
            actual_items = [(o["item"], int(o["quantity"]) if isinstance(o["quantity"], str) else o["quantity"]) for o in order]
            expected_items = [(o["item"], o["quantity"]) for o in expected_order]
            accuracy = 1 if actual_items == expected_items else 0
            order_accuracies.append(accuracy)
            print(f"Actual Order: {actual_items}, Expected Order: {expected_items}")
        elif actual_agent == "order_taking_agent" and test_case.get("expected_order") is None:
            order_accuracies.append(0)  # Mark as failure
            print(f"Actual Agent: {actual_agent} expected an order but none provided in test case: {test_case['messages'][0]['content']}")

        # Simulate user satisfaction (1-5 scale) based on agent correctness
        satisfaction = 5 if is_correct_agent else random.randint(1, 3)
        satisfaction_scores.append(satisfaction)

        # Debug print for agent
        print(f"Content: {content}, Actual Agent: {actual_agent}, Expected Agent: {test_case['expected_agent']}")

    # Aggregate results
    avg_agent_accuracy = sum(agent_correct) / len(agent_correct) if agent_correct else 0
    avg_order_accuracy = sum(order_accuracies) / len(order_accuracies) if order_accuracies else 0
    avg_satisfaction = sum(satisfaction_scores) / len(satisfaction_scores)

    # Generate report
    report = {
        "Agent Selection Accuracy": avg_agent_accuracy,
        "Order Accuracy": avg_order_accuracy,
        "Average Satisfaction Score": avg_satisfaction,
        "Test Cases Evaluated": len(test_cases)
    }

    # Save report to JSON
    with open("chatbot_evaluation_report.json", "w") as f:
        json.dump(report, f, indent=4)

    # Visualize results with adjusted layout
    metrics = ["Agent Acc.", "Order Acc.", "Satisfaction"]
    values = [avg_agent_accuracy, avg_order_accuracy, avg_satisfaction]
    
    plt.figure(figsize=(10, 6))  # Increase figure size
    plt.bar(metrics, values)
    plt.title("Chatbot Evaluation Metrics")
    plt.ylabel("Score")
    plt.ylim(0, 5)
    plt.xticks(rotation=45, ha="right")  # Rotate x-axis labels to prevent overlap
    plt.tight_layout()  # Adjust layout to fit labels
    plt.savefig("chatbot_evaluation_chart.png")
    plt.close()

    return report

if __name__ == "__main__":
    report = evaluate_chatbot()
    print("Evaluation completed. Results saved to chatbot_evaluation_report.json and chatbot_evaluation_chart.png.")