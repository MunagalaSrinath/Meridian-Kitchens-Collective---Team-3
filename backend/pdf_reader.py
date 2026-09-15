from pypdf import PdfReader


PDF_PATH = "knowledge/meridian_kitchens_menu_knowledge.pdf"


def extract_pdf_text():
    reader = PdfReader(PDF_PATH)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text