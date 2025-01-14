# News Reader Website 

## Overview
The News Reader Website Project is a Django-based web application that allows users to read and search for news articles from various sources. It leverages the News API to fetch articles based on user queries and provides a summarization feature using a transformer model. The application is designed to be user-friendly and responsive, making it easy for users to access the latest news and summaries.

## Features
- **Home Page**: Displays a list of articles related to a default topic (e.g., Bitcoin).
- **Search Functionality**: Users can search for news articles based on specific queries.
- **Article Summarization**: Users can submit URLs of articles to receive concise summaries.
- **Responsive Design**: The application is designed to work well on various devices.

## Technologies Used
- **Django**: The web framework used to build the application.
- **News API**: Provides access to news articles from various sources.
- **Transformers**: Utilizes the `facebook/bart-large-cnn` model for summarizing articles.
- **BeautifulSoup**: Used for web scraping to extract content from provided URLs.

## Usage
- **Home Page**: View the latest articles on the home page.
- **Search News**: Use the search bar to find articles related to specific topics.
- **Summarize Articles**: Submit URLs of articles to receive a summarized version.
