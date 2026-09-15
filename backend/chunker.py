import re
from pdf_reader import extract_pdf_text


def create_chunks():

    text = extract_pdf_text()

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    chunks = []

    # Find menu item lines such as:
    # 1. Chicken Biryani
    # 34. Mutton Keema Masala
    #
    # We also verify that the next line contains "Price:"
    # so summary numbers are not accidentally treated as menu items.

    item_indexes = []

    for index, line in enumerate(lines):

        if re.match(r"^\d+\.\s+", line):

            if (
                index + 1 < len(lines)
                and lines[index + 1].lower().startswith("price:")
            ):
                item_indexes.append(index)

    # Create one chunk for each menu item

    for i, start_index in enumerate(item_indexes):

        if i + 1 < len(item_indexes):
            end_index = item_indexes[i + 1]
        else:
            end_index = len(lines)

        item_lines = lines[start_index:end_index]

        chunk = "\n".join(item_lines)

        chunks.append(chunk)

    return chunks