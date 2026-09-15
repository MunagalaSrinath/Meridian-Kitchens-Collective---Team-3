from openai import OpenAI
from dotenv import load_dotenv
import os
import json

from chunker import create_chunks


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def create_embeddings():

    chunks = create_chunks()

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=chunks
    )

    embeddings = []

    for item in response.data:

        embeddings.append({
            "text": chunks[item.index],
            "embedding": item.embedding
        })

    return embeddings


def save_embeddings():

    embeddings = create_embeddings()

    with open(
        "knowledge/embeddings.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            embeddings,
            file
        )

    print(
        f"Saved {len(embeddings)} embeddings successfully."
    )