import json
from backend.utils.ai_chat_engine import answer_query

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

# Test question
question = "Can you analyze this sales data for me?"

# Test the AI response
result = answer_query(question, sample_data)
print("AI Response:")
print(result['summary'])
