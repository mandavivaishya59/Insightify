"""
========================================================
INSIGHTIFY - AI CHAT ENGINE (PRODUCTION READY)
========================================================

✔ Dataset-aware summaries (Education, Business, HR, Generic)
✔ Logical, meaningful insights (NO generic text)
✔ Pandas-first, AI-second architecture
✔ Final-year & interview safe
✔ Deterministic summaries
✔ Clean & explainable logic

========================================================
"""

# ============================
# IMPORTS
# ============================
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple
from groq import Groq
from backend.utils.Config import GROQ_API_KEY


# ============================
# GROQ CLIENT (OPTIONAL)
# ============================
client = None
if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
    try:
        client = Groq(api_key=GROQ_API_KEY)
        # Test the client with a simple request to ensure it's valid
        client.models.list()
    except:
        client = None


# ============================
# DATASET TYPE DETECTOR
# ============================
def detect_dataset_type(df: pd.DataFrame) -> str:
    cols = [c.lower() for c in df.columns]

    # Customer database detection (moved first to avoid false positives)
    if any(any(keyword in col for keyword in ["customer", "client", "contact", "email", "phone", "subscription"]) for col in cols):
        return "customer"

    # Business detection
    if any(any(keyword in col for keyword in ["sales", "revenue", "profit", "cost", "margin", "turnover"]) for col in cols):
        return "business"

    # Education detection
    if any(any(keyword in col for keyword in ["grade", "marks", "score", "gpa", "percentage"]) for col in cols):
        return "education"
    if any(c.lower().startswith("sub") for c in df.columns):
        return "education"

    # HR detection
    if any(any(keyword in col for keyword in ["salary", "department", "employee", "manager", "tenure", "experience"]) for col in cols):
        return "hr"

    # Time series detection
    if any(any(keyword in col for keyword in ["date", "time", "timestamp", "year", "month", "quarter"]) for col in cols):
        return "time_series"

    # Generic but smarter detection
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

    # If mostly numeric with some identifiers, could be measurements/products
    if len(numeric_cols) > len(cat_cols) and len(numeric_cols) > 2:
        return "measurements"

    # If mostly categorical, could be customer/product catalog
    if len(cat_cols) > len(numeric_cols) and len(cat_cols) > 3:
        return "catalog"

    return "generic"


# ============================
# BASIC DATASET ANALYSIS
# ============================

def analyze_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "numeric_columns": df.select_dtypes(include=[np.number]).columns.tolist(),
        "categorical_columns": df.select_dtypes(exclude=[np.number]).columns.tolist(),
    }


# ============================
# LOGICAL SUMMARY GENERATOR (NO AI)
# ============================

# ============================
# BACKWARD COMPATIBILITY
# ============================
def generate_business_summary(df: pd.DataFrame) -> str:
    """
    Backward compatibility wrapper.
    Calls the new dataset-aware summary engine.
    """
    return generate_logical_summary(df)

def generate_logical_summary(df: pd.DataFrame) -> str:
    dtype = detect_dataset_type(df)
    rows, cols = len(df), len(df.columns)

    # -------- EDUCATION DATASET --------
    """
    if dtype == "education" and "Grade" in df.columns:
        grade_counts = df["Grade"].value_counts()
        total = len(df)
        fail_rate = (grade_counts.get("F", 0) / total) * 100
        top_grade = grade_counts.idxmax()

        return (
            f"The dataset represents academic performance data for {total} students. "
            f"Grades range from A to F, showing varying levels of achievement. "
            f"The most common grade awarded is '{top_grade}', indicating the typical performance level. "
            f"Approximately {fail_rate:.1f}% of students have failed, which may point to learning gaps, "
            f"assessment difficulty, or the need for academic intervention. "
            f"Overall, the data highlights opportunities for targeted support to improve student outcomes."
        )
    """

    # -------- EDUCATION / STUDENT PERFORMANCE DATASET --------
    if dtype == "education" or (any(col.lower().startswith("sub") for col in df.columns)):
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        subject_cols = [c for c in numeric_cols if c.lower().startswith("sub")]

        total_students = len(df)

        if subject_cols:
            averages = df[subject_cols].mean()
            best_subject = averages.idxmax()
            worst_subject = averages.idxmin()

            # Performance classification
            overall_scores = df[subject_cols].mean(axis=1)
            distinctions = (overall_scores >= 85).sum()
            passes = ((overall_scores >= 40) & (overall_scores < 85)).sum()
            fails = (overall_scores < 40).sum()

            # Subject variability
            subject_std = df[subject_cols].std()
            most_variable = subject_std.idxmax()

            insights = [
                f"The dataset represents academic performance data for {total_students} students "
                f"across {len(subject_cols)} subjects. Performance shows clear subject-wise differentiation, "
                f"with {best_subject} achieving the highest average scores ({averages[best_subject]:.1f}) "
                f"and {worst_subject} showing comparatively lower results ({averages[worst_subject]:.1f})."
            ]

            # Grade distribution
            insights.append(
                f"Student performance distribution reveals {distinctions} distinction holders (≥85%), "
                f"{passes} passing students (40-84%), and {fails} students requiring academic support (<40%)."
            )

            # Subject consistency
            insights.append(
                f"{most_variable} demonstrates the highest score variability (σ={subject_std[most_variable]:.1f}), "
                f"indicating inconsistent performance patterns that may require focused teaching strategies."
            )

            # Gender analysis if available
            if "Gender" in df.columns:
                gender_perf = df.groupby("Gender")[subject_cols].mean().mean(axis=1)
                if len(gender_perf) > 1:
                    top_gender = gender_perf.idxmax()
                    gender_diff = gender_perf.max() - gender_perf.min()
                    insights.append(
                        f"Gender-based analysis shows {top_gender} students achieving higher average performance "
                        f"by {gender_diff:.1f} points, suggesting potential areas for equity-focused interventions."
                    )

            insights.append(
                "The uneven performance distribution across subjects highlights opportunities for "
                "personalized learning approaches and targeted academic support programs."
            )

            return " ".join(insights)

    # -------- BUSINESS DATASET --------
    if dtype == "business":
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        insights = [
            f"The dataset captures comprehensive business performance metrics across {rows} records "
            f"and {cols} operational dimensions."
        ]

        # Sales analysis
        if "Sales" in df.columns:
            total_sales = df["Sales"].sum()
            avg_sale = df["Sales"].mean()
            sales_volatility = df["Sales"].std() / df["Sales"].mean() if df["Sales"].mean() > 0 else 0

            insights.append(
                f"Total sales volume reaches {total_sales:,.0f} with an average transaction value "
                f"of {avg_sale:,.0f} and {sales_volatility:.1%} sales volatility."
            )

        # Profitability analysis
        if "Profit" in df.columns and "Sales" in df.columns:
            total_profit = df["Profit"].sum()
            profit_margin = (total_profit / total_sales) * 100 if total_sales > 0 else 0
            profitable_pct = (df["Profit"] > 0).mean() * 100

            if profit_margin > 0:
                insights.append(
                    f"Profitability analysis shows {profit_margin:.1f}% overall margin with "
                    f"{profitable_pct:.1f}% of operations generating positive returns."
                )
            else:
                insights.append(
                    f"The business operates at a loss with {profit_margin:.1f}% negative margin, "
                    f"requiring immediate profitability optimization strategies."
                )

        # Growth analysis (if time-based data exists)
        if "Year" in df.columns and "Sales" in df.columns:
            yearly_sales = df.groupby("Year")["Sales"].sum().sort_index()
            if len(yearly_sales) > 1:
                growth_rate = ((yearly_sales.iloc[-1] - yearly_sales.iloc[0]) / yearly_sales.iloc[0]) * 100
                cagr = (((yearly_sales.iloc[-1] / yearly_sales.iloc[0]) ** (1 / (len(yearly_sales) - 1))) - 1) * 100
                insights.append(
                    f"Longitudinal analysis reveals {growth_rate:.1f}% total growth and {cagr:.1f}% "
                    f"compound annual growth rate over {len(yearly_sales)} years."
                )

        # Segment analysis
        if "Segment" in df.columns and "Sales" in df.columns:
            seg_sales = df.groupby("Segment")["Sales"].sum().sort_values(ascending=False)
            top_seg = seg_sales.idxmax()
            concentration = (seg_sales.head(2).sum() / seg_sales.sum()) * 100
            insights.append(
                f"Segment performance shows {top_seg} as the dominant contributor with "
                f"{concentration:.1f}% market concentration in top segments."
            )

        # Geographic analysis
        if "Country" in df.columns and "Sales" in df.columns:
            geo_sales = df.groupby("Country")["Sales"].sum().sort_values(ascending=False)
            top_market = geo_sales.idxmax()
            market_share = (geo_sales.max() / geo_sales.sum()) * 100
            insights.append(
                f"Geographic distribution highlights {top_market} as the primary market "
                f"capturing {market_share:.1f}% of total sales."
            )

        # Product analysis (if available)
        if "Product" in df.columns and "Sales" in df.columns:
            product_perf = df.groupby("Product")["Sales"].sum().sort_values(ascending=False)
            top_product = product_perf.idxmax()
            product_concentration = (product_perf.head(3).sum() / product_perf.sum()) * 100
            insights.append(
                f"Product portfolio analysis indicates {top_product} leads performance "
                f"with top 3 products representing {product_concentration:.1f}% of sales."
            )

        insights.append(
            "Strategic insights suggest focusing on high-margin segments and optimizing "
            "underperforming areas for enhanced business performance."
        )

        return " ".join(insights)

    # -------- HR DATASET --------
    if dtype == "hr":
        insights = [
            f"The dataset encompasses comprehensive workforce information for {rows} employees "
            f"across {cols} organizational dimensions, enabling detailed HR analytics."
        ]

        # Salary analysis
        if "Salary" in df.columns:
            avg_salary = df["Salary"].mean()
            median_salary = df["Salary"].median()
            salary_range = df["Salary"].max() - df["Salary"].min()
            salary_quartiles = df["Salary"].quantile([0.25, 0.75])

            insights.append(
                f"Compensation analysis reveals an average salary of {avg_salary:,.0f} with median "
                f"earnings at {median_salary:,.0f}. The salary range spans {salary_range:,.0f}, "
                f"with interquartile range from {salary_quartiles[0.25]:,.0f} to {salary_quartiles[0.75]:,.0f}."
            )

        # Department analysis
        if "Department" in df.columns:
            dept_counts = df["Department"].value_counts()
            largest_dept = dept_counts.idxmax()
            dept_concentration = (dept_counts.head(3).sum() / dept_counts.sum()) * 100

            insights.append(
                f"Workforce distribution shows {largest_dept} as the largest department with "
                f"{dept_counts[largest_dept]} employees. Top 3 departments represent {dept_concentration:.1f}% "
                f"of total headcount across {len(dept_counts)} departments."
            )

            # Department-wise salary analysis
            if "Salary" in df.columns:
                dept_salary = df.groupby("Department")["Salary"].mean().sort_values(ascending=False)
                highest_paid_dept = dept_salary.idxmax()
                salary_variance = dept_salary.std() / dept_salary.mean()
                insights.append(
                    f"Departmental compensation varies significantly, with {highest_paid_dept} "
                    f"showing highest average pay and {salary_variance:.1%} inter-departmental variance."
                )

        # Experience/Tenure analysis
        if "Tenure" in df.columns or "Experience" in df.columns:
            tenure_col = "Tenure" if "Tenure" in df.columns else "Experience"
            avg_tenure = df[tenure_col].mean()
            tenure_distribution = df[tenure_col].quantile([0.25, 0.5, 0.75])

            insights.append(
                f"Workforce experience analysis indicates average tenure of {avg_tenure:.1f} years, "
                f"with 25th percentile at {tenure_distribution[0.25]:.1f} years, median at "
                f"{tenure_distribution[0.5]:.1f} years, and 75th percentile at {tenure_distribution[0.75]:.1f} years."
            )

        # Gender diversity analysis
        if "Gender" in df.columns:
            gender_dist = df["Gender"].value_counts(normalize=True) * 100
            diversity_index = 1 - sum((gender_dist/100)**2)  # Simpson's diversity index

            insights.append(
                f"Workforce diversity metrics show gender distribution with "
                f"{diversity_index:.3f} diversity index, indicating representation patterns "
                f"across {len(gender_dist)} gender categories."
            )

        # Manager/Employee ratio
        if "Manager" in df.columns:
            manager_ratio = df["Manager"].notna().mean() * 100
            insights.append(
                f"Organizational structure analysis reveals {manager_ratio:.1f}% of employees "
                f"in supervisory roles, suggesting management span of control considerations."
            )

        insights.append(
            "Strategic HR insights highlight opportunities for compensation equity, "
            "workforce planning, and organizational development initiatives."
        )

        return " ".join(insights)

    # -------- CUSTOMER DATASET --------
    if dtype == "customer":
        insights = [
            f"The dataset contains comprehensive customer information for {rows} contacts "
            f"across {cols} profile dimensions, enabling detailed customer analytics."
        ]

        # Geographic distribution
        if "Country" in df.columns:
            country_dist = df["Country"].value_counts().head(5)
            top_country = country_dist.idxmax()
            concentration = (country_dist.max() / country_dist.sum()) * 100
            unique_countries = df["Country"].nunique()

            insights.append(
                f"Customer base spans {unique_countries} countries with {top_country} representing "
                f"the largest market segment at {concentration:.1f}% of total customers."
            )

        # Company analysis
        if "Company" in df.columns:
            company_dist = df["Company"].value_counts()
            unique_companies = company_dist.nunique()
            top_company = company_dist.idxmax()
            company_concentration = (company_dist.max() / company_dist.sum()) * 100

            insights.append(
                f"Business customer analysis shows {unique_companies} unique companies, "
                f"with {top_company} being the most represented at {company_concentration:.1f}%."
            )

        # Subscription analysis
        if "Subscription Date" in df.columns:
            try:
                df["Subscription Date"] = pd.to_datetime(df["Subscription Date"])
                subscription_trend = df.groupby(df["Subscription Date"].dt.year)["Subscription Date"].count()
                if len(subscription_trend) > 1:
                    growth = ((subscription_trend.iloc[-1] - subscription_trend.iloc[0]) / subscription_trend.iloc[0]) * 100
                    insights.append(
                        f"Subscription growth analysis indicates {growth:.1f}% change in customer acquisition "
                        f"over the observation period."
                    )
            except:
                pass

        # Contact completeness
        contact_cols = ["Phone 1", "Phone 2", "Email", "Website"]
        completeness = {}
        for col in contact_cols:
            if col in df.columns:
                completeness[col] = (df[col].notna() & (df[col] != "")).mean() * 100

        if completeness:
            avg_completeness = sum(completeness.values()) / len(completeness)
            insights.append(
                f"Contact information completeness averages {avg_completeness:.1f}% across available channels, "
                f"with Email showing the highest completion rate."
            )

        # Monthly distribution
        if "Month Name" in df.columns:
            monthly_dist = df["Month Name"].value_counts()
            peak_month = monthly_dist.idxmax()
            seasonal_concentration = (monthly_dist.max() / monthly_dist.sum()) * 100
            insights.append(
                f"Customer acquisition shows seasonal patterns with {peak_month} being the peak month "
                f"accounting for {seasonal_concentration:.1f}% of subscriptions."
            )

        insights.append(
            "Customer insights enable targeted marketing, retention strategies, and personalized "
            "customer relationship management initiatives."
        )

        return " ".join(insights)

    # -------- TIME SERIES DATASET --------
    if dtype == "time_series":
        insights = [
            f"The dataset contains {rows} time-series observations across {cols} dimensions, "
            f"enabling temporal pattern analysis and trend identification."
        ]

        # Date/Time analysis
        date_cols = [c for c in df.columns if c.lower() in ["date", "time", "timestamp", "year", "month", "quarter"]]
        if date_cols:
            date_col = date_cols[0]
            if df[date_col].dtype in ['datetime64[ns]', 'object']:
                try:
                    df[date_col] = pd.to_datetime(df[date_col])
                    date_range = (df[date_col].max() - df[date_col].min()).days
                    insights.append(
                        f"Temporal coverage spans {date_range} days from {df[date_col].min().date()} "
                        f"to {df[date_col].max().date()}, providing comprehensive historical perspective."
                    )
                except:
                    pass

        # Trend analysis for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols and len(df) > 1:
            for col in numeric_cols[:3]:  # Analyze first 3 numeric columns
                values = df[col].dropna()
                if len(values) > 1:
                    trend = "increasing" if values.iloc[-1] > values.iloc[0] else "decreasing"
                    change_pct = ((values.iloc[-1] - values.iloc[0]) / abs(values.iloc[0])) * 100 if values.iloc[0] != 0 else 0
                    volatility = values.std() / values.mean() if values.mean() > 0 else 0

                    insights.append(
                        f"{col} shows {trend} trend with {change_pct:.1f}% change and {volatility:.1%} volatility "
                        f"over the observation period."
                    )

        # Seasonality detection (basic)
        if "Month" in df.columns and numeric_cols:
            monthly_avg = df.groupby("Month")[numeric_cols[0]].mean()
            seasonality_strength = monthly_avg.std() / monthly_avg.mean() if monthly_avg.mean() > 0 else 0
            if seasonality_strength > 0.1:
                insights.append(
                    f"Seasonal patterns detected with {seasonality_strength:.1%} seasonal variation, "
                    f"suggesting periodic fluctuations in the data."
                )

        insights.append(
            "Time series insights enable forecasting, anomaly detection, and strategic planning "
            "based on historical patterns and trends."
        )

        return " ".join(insights)

    # -------- MEASUREMENTS DATASET --------
    if dtype == "measurements":
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

        insights = [
            f"The dataset contains {rows} measurement records with {len(numeric_cols)} quantitative "
            f"metrics and {len(cat_cols)} categorical dimensions."
        ]

        # Statistical summary
        if numeric_cols:
            stats_summary = df[numeric_cols].describe()
            high_variability = []
            for col in numeric_cols:
                cv = df[col].std() / df[col].mean() if df[col].mean() > 0 else 0
                if cv > 0.5:  # High variability
                    high_variability.append(col)

            if high_variability:
                insights.append(
                    f"High variability observed in {', '.join(high_variability)}, indicating diverse "
                    f"measurement conditions or multiple subgroups within the data."
                )

        # Correlation analysis
        if len(numeric_cols) > 2:
            corr_matrix = df[numeric_cols].corr()
            strong_correlations = []
            for i in range(len(numeric_cols)):
                for j in range(i+1, len(numeric_cols)):
                    corr = corr_matrix.iloc[i, j]
                    if abs(corr) > 0.7:
                        strong_correlations.append(f"{numeric_cols[i]}-{numeric_cols[j]} ({corr:.2f})")

            if strong_correlations:
                insights.append(
                    f"Strong correlations detected between: {', '.join(strong_correlations)}, "
                    f"suggesting underlying relationships in the measurement data."
                )

        insights.append(
            "Measurement data analysis supports quality control, process optimization, "
            "and performance benchmarking across different conditions."
        )

        return " ".join(insights)

    # -------- CATALOG DATASET --------
    if dtype == "catalog":
        cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        insights = [
            f"The dataset represents a catalog of {rows} items with {len(cat_cols)} descriptive "
            f"attributes and {len(numeric_cols)} quantitative properties."
        ]

        # Category distribution
        if cat_cols:
            for col in cat_cols[:3]:  # Analyze first 3 categorical columns
                unique_count = df[col].nunique()
                top_category = df[col].mode().iloc[0] if not df[col].empty else "N/A"
                concentration = (df[col] == top_category).mean() * 100

                insights.append(
                    f"{col} contains {unique_count} unique values with '{top_category}' "
                    f"representing {concentration:.1f}% of entries."
                )

        # Numeric properties analysis
        if numeric_cols:
            price_cols = [c for c in numeric_cols if "price" in c.lower() or "cost" in c.lower()]
            if price_cols:
                avg_price = df[price_cols[0]].mean()
                price_range = df[price_cols[0]].max() - df[price_cols[0]].min()
                insights.append(
                    f"Pricing analysis shows average {price_cols[0]} of {avg_price:,.2f} "
                    f"with range spanning {price_range:,.2f}."
                )

        insights.append(
            "Catalog analysis enables inventory management, pricing strategy, "
            "and product portfolio optimization."
        )

        return " ".join(insights)

    # -------- GENERIC DATASET --------
    # Enhanced generic analysis
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    missing_pct = df.isnull().mean().mean() * 100

    insights = [
        f"The dataset contains {rows} records with {cols} variables, comprising "
        f"{len(numeric_cols)} numeric and {len(cat_cols)} categorical attributes."
    ]

    if missing_pct > 0:
        insights.append(
            f"Data completeness analysis shows {missing_pct:.1f}% missing values overall, "
            f"which may impact analysis reliability."
        )

    # Data type distribution insights
    if numeric_cols:
        numeric_stats = df[numeric_cols].describe()
        skewed_cols = []
        for col in numeric_cols:
            skewness = df[col].skew()
            if abs(skewness) > 1:
                skewed_cols.append(col)

        if skewed_cols:
            insights.append(
                f"Distribution analysis indicates skewed patterns in {', '.join(skewed_cols)}, "
                f"suggesting non-normal data characteristics."
            )

    if cat_cols:
        for col in cat_cols[:2]:
            unique_pct = (df[col].nunique() / len(df)) * 100
            if unique_pct > 50:
                insights.append(
                    f"{col} shows high cardinality ({unique_pct:.1f}% unique values), "
                    f"potentially requiring grouping or encoding strategies."
                )

    insights.append(
        "Generic dataset analysis supports exploratory data understanding, "
        "feature engineering, and hypothesis generation for further investigation."
    )

    return " ".join(insights)


# ============================
# SUMMARY INTENT DETECTOR
# ============================
def is_summary_intent(question: str) -> bool:
    keywords = [
        "summary", "summarize", "overview", "analyze", "analysis", "insights",
        "explain", "describe", "tell me about", "what is in the data",
        "detailed summary", "comprehensive"
    ]
    q = question.lower()
    return any(k in q for k in keywords)


# ============================
# MAIN QUERY HANDLER
# ============================
def answer_query(question: str, df_json: dict) -> Dict[str, Any]:
    try:
        df = pd.DataFrame(df_json)

        if df.empty:
            return {
                "summary": "The dataset is empty. Please upload a valid dataset.",
                "chart": None
            }

        # -------- SUMMARY REQUEST --------
        if is_summary_intent(question):
            summary = generate_logical_summary(df)
            return {
                "summary": summary,
                "chart": None
            }

        # -------- GENERAL QUESTION (AI OPTIONAL) --------
        if client:
            analysis = analyze_dataset(df)

            system_prompt = f"""
You are Insightify, a professional data analyst.

Dataset has {analysis['rows']} rows and {analysis['columns']} columns.
Answer the user's question clearly, logically, and based strictly on the data.
"""

            response = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                temperature=0.2,
                max_tokens=500
            )

            return {
                "summary": response.choices[0].message.content.strip(),
                "chart": None
            }

        return {
            "summary": "I can help summarize or analyze the dataset. Please ask a relevant question.",
            "chart": None
        }

    except Exception as e:
        print("Insightify Error:", e)
        return {
            "summary": "Sorry, I was not able to perform advanced analysis on this dataset.",
            "chart": None
        }


# ============================
# SAFE DATA CLEANER
# ============================
def clean_dataset(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    df = df.copy()
    report = {
        "original_rows": len(df),
        "original_columns": len(df.columns),
        "missing_values_filled": 0,
        "duplicates_removed": 0,
    }

    df.columns = [c.strip() for c in df.columns]

    for col in df.columns:
        missing = df[col].isna().sum()
        if missing:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna("Unknown")
            report["missing_values_filled"] += missing

    before = len(df)
    df = df.drop_duplicates()
    report["duplicates_removed"] = before - len(df)

    report["final_rows"] = len(df)
    report["final_columns"] = len(df.columns)

    return df, report
