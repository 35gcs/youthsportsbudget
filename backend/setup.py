from setuptools import setup, find_packages

setup(
    name="youth-sports-budget",
    version="1.0.0",
    description="Budgeting and financial management for youth sports organizations",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "sqlalchemy==2.0.23",
        "pydantic==2.5.0",
        "email-validator==2.3.0",
        "python-dotenv==1.0.0",
    ],
)
