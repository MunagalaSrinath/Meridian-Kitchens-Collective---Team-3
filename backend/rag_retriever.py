from openai import OpenAI
from dotenv import load_dotenv
import os

from vector_store import search_vectors


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def retrieve_menu_information(
    question,
    top_k=3
):

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    )

    query_embedding = response.data[0].embedding

    results = search_vectors(
        query_embedding,
        top_k=top_k
    )

    return results