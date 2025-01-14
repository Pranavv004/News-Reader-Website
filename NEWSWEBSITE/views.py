from django.shortcuts import render
from django.http import JsonResponse
import requests


API_KEY = '663d76a6fa35419b8ab4369c8bdbb141'
# Create your views here.
def home(request):

    url = f'https://newsapi.org/v2/everything?q=bitcoin&apiKey={API_KEY}'
    response = requests.get(url)
    data = response.json()
    articles = data['articles']
    

    context = {
        'articles' : articles
    }
    
    return render(request,'base/home.html',context)

def search_news(request):
    query = request.GET.get('query', '').strip()  # Get the query parameter and strip whitespace
    if query:  
        url = f'https://newsapi.org/v2/everything?q={query}&apiKey={API_KEY}'
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            articles = data.get('articles', [])
            if articles:  
                return JsonResponse({'articles': articles})
            else:
                return JsonResponse({'error': 'No articles found for this query.'}, status=404)
        else:
            return JsonResponse({'error': 'Failed to fetch news from API.'}, status=response.status_code)
        
#=====================================================
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import warnings
from transformers import pipeline
import torch
from bs4 import BeautifulSoup
import json

# Suppress warnings and set tensor print options
warnings.filterwarnings("ignore", category=UserWarning)
torch.set_printoptions(profile="none")

# Initialize summarizer model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


# Suppress warnings and set torch options
warnings.filterwarnings("ignore", category=UserWarning)
torch.set_printoptions(profile="none")

# Initialize the summarizer

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@csrf_exempt
def get_summary(request):
    if request.method == "POST":
        try:
            # Get URLs from query parameters
            data = json.loads(request.body)
            urls = data.get('urls', [])  
        
            if not urls:
                return JsonResponse({'error': 'No URLs provided'}, status=400)

            all_results = []

            # Loop through the list of URLs and scrape the content
            for url in urls:
                try:
                    # Send a request to fetch the webpage
                    response = requests.get(url)
                    soup = BeautifulSoup(response.content, 'html.parser')

                    # Extract title and description (modify as per your need)
                    title = soup.title.string if soup.title else 'No title'
                    description = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
                    description_text = description['content'] if description else soup.get_text()

                    # Combine title and description for summarization
                    article_text = f"{title}\n{description_text}"
                    all_results.append(article_text)

                except Exception as e:
                    all_results.append(f"Error scraping {url}: {str(e)}")

            # Combine all results and summarize the text
            combined_text = " ".join(all_results)

            # Split the text into manageable chunks (to avoid input size limitations for the model)
            chunk_size = 1000
            chunks = [combined_text[i:i + chunk_size] for i in range(0, len(combined_text), chunk_size)]

            # Summarize each chunk
            def summarize_article(text):
                try:
                    
                    summary = summarizer(text, max_length=110, min_length=100, do_sample=False)
                    return summary[0]['summary_text']
                except Exception as e:
                    return f"Error summarizing text: {e}"

            summaries = [summarize_article(chunk) for chunk in chunks]
            final_summary = " ".join(summaries)

            # Return the summary as JSON response
            print(final_summary)
            return JsonResponse({'summary': final_summary})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)