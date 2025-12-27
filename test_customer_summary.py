import json
from backend.utils.ai_chat_engine import answer_query

# Sample customer dataset based on user's description
customer_data = [
    {
        "Customer Id": "DD37Cf93aecA6Dc",
        "First Name": "Sheryl",
        "Last Name": "Baxter",
        "Company": "Rasmussen Group",
        "City": "East Leonard",
        "Country": "Chile",
        "Phone 1": "229.077.5154",
        "Phone 2": "397.884.0519x718",
        "Email": "zunigavanessa@smith.info",
        "Subscription Date": "2020-08-24",
        "Website": "http://www.stephenson.com/",
        "Year": 2020,
        "Month Number": 8,
        "Month Name": "August"
    },
    {
        "Customer Id": "1Ef7b82A4CAAD10",
        "First Name": "Preston",
        "Last Name": "Lozano",
        "Company": "Vega-Gentry",
        "City": "East Jimmychester",
        "Country": "Djibouti",
        "Phone 1": "5153435776",
        "Phone 2": "686-620-1820x944",
        "Email": "vmata@colon.com",
        "Subscription Date": "2021-04-23",
        "Website": "http://www.hobbs.com/",
        "Year": 2021,
        "Month Number": 4,
        "Month Name": "April"
    },
    {
        "Customer Id": "6F94879bDAfE5a6",
        "First Name": "Roy",
        "Last Name": "Berry",
        "Company": "Murillo-Perry",
        "City": "Isabelborough",
        "Country": "Antigua and Barbuda",
        "Phone 1": "+1-539-402-0259",
        "Phone 2": "(496)978-3969x58947",
        "Email": "beckycarr@hogan.com",
        "Subscription Date": "2020-03-25",
        "Website": "http://www.lawrence.com/",
        "Year": 2020,
        "Month Number": 3,
        "Month Name": "March"
    }
]

# Test question
question = "Can you summarize this customer data?"

# Test the AI response
result = answer_query(question, customer_data)
print("AI Response:")
print(result['summary'])
