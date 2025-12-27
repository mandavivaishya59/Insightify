from backend.utils.ai_chat_engine import is_summary_intent, generate_structured_business_summary
import json
import pandas

# Sample dataset
sample_data = [
    {
        "Segment": "Government",
        "Country": "Germany",
        "Product": "Carretera",
        "Discount Band": "None",
        "Units Sold": 1321,
        "Manufacturing Price": 3,
        "Sale Price": 20,
        "Gross Sales": 26420,
        "Discounts": 0,
        "Sales": 26420,
        "COGS": 15972,
        "Profit": 10448,
        "Date": "1/1/2014",
        "Month Number": 1,
        "Month Name": "January",
        "Year": 2014
    },
    {
        "Segment": "Midmarket",
        "Country": "France",
        "Product": "Carretera",
        "Discount Band": "Low",
        "Units Sold": 2178,
        "Manufacturing Price": 3,
        "Sale Price": 15,
        "Gross Sales": 32670,
        "Discounts": 326.7,
        "Sales": 32343.3,
        "COGS": 26136,
        "Profit": 6207.3,
        "Date": "6/1/2014",
        "Month Number": 6,
        "Month Name": "June",
        "Year": 2014
    }
]

# Test questions
test_questions = [
    "What are the key insights from this sales data?",  # Should trigger summary
    "Can you analyze this sales data for me?",  # Should not trigger summary
    "Give me a summary of the dataset",  # Should trigger summary
    "What trends do you see in this data?",  # Should not trigger summary
    "Summarize the sales performance",  # Should trigger summary
    "How is the business doing?",  # Should not trigger summary
]

print("Testing summary intent detection:")
for question in test_questions:
    intent = is_summary_intent(question)
    print(f"Question: '{question}' -> Summary Intent: {intent}")

print("\nStructured Summary for reference:")
df = pd.DataFrame(sample_data) # type: ignore
summary = generate_structured_business_summary(df)
print(summary)
