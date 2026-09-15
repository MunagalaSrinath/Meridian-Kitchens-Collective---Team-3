from rag_retriever import retrieve_menu_information


def get_rag_context(question, top_k=3):

    results = retrieve_menu_information(
        question,
        top_k=top_k
    )

    if not results:
        return "No relevant menu information was found."

    context_parts = []

    for index, result in enumerate(results, start=1):

        context_parts.append(
            f"""
--- MENU RESULT {index} ---

{result["text"]}
"""
        )

    return "\n".join(context_parts)