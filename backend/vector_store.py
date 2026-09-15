import faiss
import json
import numpy as np


EMBEDDINGS_PATH = "knowledge/embeddings.json"
INDEX_PATH = "knowledge/menu.index"


def create_vector_index():

    with open(
        EMBEDDINGS_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        data = json.load(file)

    vectors = np.array(
        [item["embedding"] for item in data],
        dtype="float32"
    )

    # Create FAISS index using cosine similarity
    faiss.normalize_L2(vectors)

    index = faiss.IndexFlatIP(
        vectors.shape[1]
    )

    index.add(vectors)

    faiss.write_index(
        index,
        INDEX_PATH
    )

    print(
        f"Vector index created with {len(data)} chunks."
    )


def search_vectors(query_embedding, top_k=3):

    index = faiss.read_index(
        INDEX_PATH
    )

    query = np.array(
        [query_embedding],
        dtype="float32"
    )

    faiss.normalize_L2(query)

    scores, indexes = index.search(
        query,
        top_k
    )

    with open(
        EMBEDDINGS_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        data = json.load(file)

    results = []

    for score, index_number in zip(
        scores[0],
        indexes[0]
    ):

        if index_number == -1:
            continue

        results.append({
            "text": data[index_number]["text"],
            "score": float(score)
        })

    return results